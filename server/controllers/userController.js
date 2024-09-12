import User from "../models/userModel.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: true,
};
/**
 * USER REGISTRATION MODULE
 */
export const register = async (req, res, next) => {
  const { fullname, email, phone, password } = req.body;
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
  (await user).save();
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

    if (!user || !user.comparePassword(password, user.password)) {
      return next(new AppError("Email or password do not match", 400));
    }
    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
