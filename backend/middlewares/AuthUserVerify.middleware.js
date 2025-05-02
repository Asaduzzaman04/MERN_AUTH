import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

// Middleware to verify user before sending OTP for email verification
export const AuthUserVerify = [
  // Validation rules for email field in request body
  body("email")
    .trim() // Removes leading/trailing whitespace from email
    .notEmpty() // Ensures email field is not empty
    .withMessage("Email is required") // Error message if empty
    .isEmail() // Validates email format
    .withMessage("Please enter a valid email"), // Error message if invalid

  // Middleware function to process the request
  async (req, res, next) => {
    // Check for validation errors from the rules above
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ // Return 400 if validation fails
        success: false,
        message: "Cannot verify with this email",
        errors: errors.array(), // Include specific validation errors
      });
    }

    try {
      // Extract token from Authorization header or x-auth-token cookie
      const token =
        req?.headers?.authorization?.split(" ")[1] || // Gets token after "Bearer " from header
        req?.cookies?.["x-auth-token"]; // Falls back to cookie if header is missing

      // Check if token exists
      if (!token) {
        return res.status(401).json({ // Return 401 if no token found
          success: false,
          message: "No token provided",
        });
      }

      // Verify the token with the JWT secret
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res.status(403).json({ // Return 403 if token verification fails
          success: false,
          message: "User unauthorized: Invalid token",
        });
      }

      // Find user by ID from decoded token
      const user = await UserModel.findById(decodedToken._id);
      if (!user) {
        return res.status(404).json({ // Return 404 if user not found
          success: false,
          message: "User not found",
        });
      }

      // Check if account is already verified (no need to send OTP if verified)
      if (user.isAccountVerified) {
        return res.status(400).json({ // Return 400 if account is already verified
          success: false,
          message: "Account is already verified",
        });
      }

      // Check if an unexpired OTP already exists
      if (user.verifyOTP.length > 0 && user.verifyOTPExpireAt > Date.now()) {
        return res.status(400).json({ // Return 400 if a valid OTP is still active
          success: false,
          message: "OTP already sent to your email",
        });
      }

      // Attach user document to request object
      req.userInfo = user;
      next(); // Proceed to the next middleware or route handler

    } catch (error) {
      // Log error for debugging
      console.log(`Error at AuthUserVerify middleware: ${error}`);
      // Send error response to client
      return res.status(500).json({
        success: false,
        message: "Server error during authentication",
        error: error.message,
      });
    }
  },
];