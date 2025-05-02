import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import BlackListUser from "./../models/BlackListToken.model.js";

export const AuthUserLogout = async (req, res, next) => {
  try {
    // Extract token from cookies or authorization header
    const token =
      req.cookies?.["x-auth-token"] || req.headers.authorization?.split(" ")[1];

    // If no token is provided, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization denied. No token provided.",
      });
    }
    const isBlacklisted = await BlackListUser.findOne({ token });
    // If token is blacklisted  return error
    if (isBlacklisted) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in the database by ID
    const findUser = await UserModel.findById(decoded._id);

    // If user does not exist, return an error
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Unauthorized access.",
      });
    }
    req.user = findUser;
    req.token = token;
    return next();
  } catch (error) {
    console.error("Error in AuthUserLogout middleware:", error.message);
    return next(error);
  }
};
