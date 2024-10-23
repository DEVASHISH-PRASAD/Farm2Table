import User from "../models/userModel.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path:"/"
};
/**
 * USER REGISTRATION MODULE
 */
export const register = async (req, res, next) => {
  const { fullname, email, phone, password,role } = req.body;
  console.log("REQUEST::", req.body);

  if (!fullname || !email || !phone || !password) {
    return next(new AppError("All fields are mandatory!!", 400));
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError("User already exists!!", 400));
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
    if(!user){
    res.status(400).json({
      success:false,
      message:"User not registered!!"
    })
  }
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({
        success:false,
        message:"Email and Password do not match"
      })
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
     return next(new AppError("Failed to fetch the user details",500))
  }
};

/**
 * LOGOUT MODULE
 */

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      secure: true,
      maxAge: 0,
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {}
};
