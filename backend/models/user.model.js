import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create a User Schema with validation rules
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
      minlength: [3, "Name should be at least 3 characters long"], // Minimum length validation
    },
    email: {
      type: String,
      required: true, // Email is required
      unique: true, // Ensure each email is unique
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ], // Regular expression to validate email format
    },
    password: {
      type: String,
      required: true, // Password is required
      minlength: [6, "Password should be at least 6 characters long"], // Minimum length validation
      select: false, // Prevent password from being returned in queries by default
    },
    verifyOTP: {
      type: String,
      default: "", // Stores OTP for email verification
    },
    verifyOTPExpireAt: {
      type: Number,
      default: 0, // Stores OTP expiration timestamp
    },
    isAccountVerified: {
      type: Boolean,
      default: false, // Indicates whether the user's account is verified
    },
    resetOTP: {
      type: String,
      default: "", // Stores OTP for password reset
    },
    resetOTPExpireAt: {
      type: Number,
      default: 0, // Stores expiration timestamp for password reset OTP
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` timestamps automatically
);

//  Static Method: Hash a password before storing it in the database
UserSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

//  Instance Method: Verify a user's entered password with the stored hash
UserSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//  Instance Method: Generate an authentication token (JWT) for the user
UserSchema.methods.authToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

//  Model Creation: Ensure we don't redefine the model if it already exists
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
