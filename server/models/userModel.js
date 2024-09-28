import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is required!!"],
      minLength: [5, "Name must be at least 5 characters!!"],
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
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [, "Password is required!!"],
      minLength: [8, "Password must be at least 8 characters!!"],
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
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
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
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
  },
};

const User = model("UserData", userSchema);

export default User;
