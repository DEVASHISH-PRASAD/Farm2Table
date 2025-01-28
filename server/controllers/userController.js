import User from "../models/userModel.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
};
/**
 * USER REGISTRATION MODULE
 */
export const register = async (req, res, next) => {
  const { fullname, email, phone, password, role } = req.body;
  console.log("REQUEST::", req.body);

  if (!fullname || !email || !phone || !password) {
    return next(new AppError("All fields are mandatory!!", 400));
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({
      message:"User already exists!"
    })
  }
  const user = await User.create({
    fullname,
    email,
    phone,
    password,
    role,
    avatar: {
      public_id: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });
  if (!user) {
    return next(
      new AppError("User registration failed, please try again!!", 400)
    );
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "F2M",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });
      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (err) {
      return next(
        new AppError(err || "file not uploaded ,please try again!", 500)
      );
    }
  }
  await user.save();
  user.password = undefined;

  const token = await user.generateJWTToken();

  res.cookie("token", token, cookieOption);

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};

/**
 * USER LOGIN MODULE
 */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password is required!!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not registered!!",
      });
    }
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({
        success: false,
        message: "Email and Password do not match",
      });
      return next(new AppError("Email or password do not match", 400));
    }
    const token = await user.generateJWTToken();
    user.password = undefined;

    console.log("Setting cookie...");
    res.cookie("token", token, cookieOption);
    console.log("Cookie Set:", { name: "token", value: token });

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * GET PROFILE MODULE
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: "User-Details",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch the user details", 500));
  }
};

/**
 * LOGOUT MODULE
 */

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      httpOnly: true,
      sameSite:"None"
    });
    console.log("Cookie cleared");
    res.status(200).json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {}
};

/**
 * PASSWORD RESET FLOW
 */

// Controller to request password reset
export const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found with that email address",
      });
    }

    // Generate reset token
    const resetToken = await user.generatePasswordResetToken();

    // Save the reset token and expiry to the user record
    await user.save();

    // Create a reset password URL
    const resetUrl = `${process.env.FRONTEND_URI}/reset-password?resetToken=${resetToken}`;

    // Send reset password email
    const message = `You requested a password reset. Click the link below to reset your password:
    \n\n${resetUrl}\n\n
    If you did not request this, please ignore this email.`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({
      message: "Password reset link has been sent to your email!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

// Controller to reset password
export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const {resetToken}=req.query;

  try {
    // Check if reset token is provided
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    // Hash the reset token and check against the stored one
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() }, // Check if the token has not expired
      forgotPasswordUsed: false, // Check if the token is not already used
    });

    // If user is not found or token is expired
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Update the user's password and mark the token as used
    user.password = newPassword;
    user.forgotPasswordUsed = true; // Mark the token as used
    user.forgotPasswordToken = undefined; // Clear the reset token
    user.forgotPasswordExpiry = undefined; // Clear the expiry

    // Hash the new password before saving
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while resetting your password.",
    });
  }
};
