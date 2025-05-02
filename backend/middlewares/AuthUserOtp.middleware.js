import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { body, validationResult } from "express-validator"; // Added validationResult

// Middleware to verify user and OTP conditions
export const AuthUserOtp = [
  // Validation rules for verifyOTP field in request body
  body("verifyOTP")
    .trim() // Remove leading/trailing whitespace
    .notEmpty() // Ensure OTP is provided
    .withMessage("OTP is required") 
    .isLength({ min: 6, max: 6 }) // Ensure OTP is exactly 6 digits (based on your schema)
    .withMessage("OTP must be 6 digits"),
  //  middleware function
  async (req, res, next) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
        errors: errors.array(), // Include validation errors
      });
    }

    // Extract token from header or cookie
    const token =
      req.headers?.authorization?.split(" ")[1] || // Bearer token from header
      req?.cookies?.["x-auth-token"]; // Fallback to cookie

    try {
      // Check if token exists
      if (!token) {
        return res.status(401).json({
          // 401 for unauthorized
          success: false,
          message: "Unauthorized: Please login again",
        });
      }

      // Verify the JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res.status(403).json({
          // 403 for invalid token
          success: false,
          message: "Unauthorized: Invalid token, please login again",
        });
      }

      // Fetch user by ID from decoded token
      const userInfo = await UserModel.findById(decodedToken._id);
      if (!userInfo) {
        return res.status(404).json({
          // 404 if user not found
          success: false,
          message: "User not found",
        });
      }

      // Check if account is already verified (assuming this middleware is for sending OTP)
      if (userInfo.isAccountVerified) {
        return res.status(400).json({
          // 400 if account is already verified
          success: false,
          message: "Account is already verified",
        });
      }

      // Check if an unexpired OTP already exists
      if (userInfo.verifyOTP.length === 0) {
        return res.status(400).json({
          // 400 if OTP is still valid
          success: false,
          message: "verify your email first",
        });
      }

      // Attach user document to request for the next handler
      req.userInfo = userInfo;
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Log error for debugging
      console.log(`Error in AuthUserOtp Middleware: ${error}`);
      // Send error response to client
      return res.status(500).json({
        success: false,
        message: "Server error during authentication",
        error: error.message,
      });
    }
  },
];
