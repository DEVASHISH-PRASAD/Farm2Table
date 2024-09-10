import { model, Schema } from "mongoose";
import bcrypt, { compare } from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is required!!"],
      minLength: [5, "Name must be atleast 5 characters!!"],
      maxLength: [50, "Name must be less than 50 characters!!"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!!"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required!!"],
      trime: true,
      minLength: [8, "Password must be atleast of 8 characters!!"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required!"],
    },
    role: {
      type: String,
      enum: ["FARMER", "CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt(this.password, 10);
  }
});

userSchema.methods = {
  generateJWTToken: async function () {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },

  generatePasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() * 15 * 60 * 1000; //15 min

    return resetToken;
  },
};
