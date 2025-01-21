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
    },
    password: {
      type: String,
      required: [true, "Password is required!!"],
      minLength: [8, "Password must be at least 8 characters!!"],
    },
    phone: {
      type: String, // Changed from Number to String
      required: [true, "Phone number is required!"],
    },
    role: {
      type: String,
      enum: ["FARMER", "CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
    avatar: {
      public_id: String,
      secure_url: String,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    forgotPasswordUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent double hashing of password
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.password.startsWith("$2a$")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// User Methods
userSchema.methods = {
  generateJWTToken: function () {
    return JWT.sign(
      { id: this._id, email: this.email, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  },

  comparePassword: function (plainTextPassword) {
    return bcrypt.compare(plainTextPassword, this.password);
  },

  generatePasswordResetToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    this.forgotPasswordUsed = false; 
    return resetToken;
  },
};

const User = model("UserData", userSchema);

export default User;
