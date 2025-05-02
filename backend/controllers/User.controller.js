import UserModel from "../models/user.model.js";
import { CreateUser } from "../services/CreateUser.js";
import BlackListUser from "./../models/BlackListToken.model.js";
import transporter from "./../config/nodemail.config.js";
import sendWelcomeEmailTemplete from "./../utils/welcomeEmailTemplate.js";
import OtpTemplete from "../utils/OtpTemplete.js";
import jwt from "jsonwebtoken";

// Register user controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the user password
    const hashedPassword = await UserModel.hashPassword(password);

    // Create a new user
    const newUser = await CreateUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generate authentication token
    const authToken = newUser.authToken();

    //set token in header
    res.set("Authorization", `Bearer ${authToken}`);
    //set tooken in cookie
    res.cookie("x-auth-token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //email send function
    //sent a welcome email to user
    /*
    const mainOPtion = {
        from: `"MERN_AUTH" <${process.env.SENDER_MAIL}>`,
        to: `${email}`,
        subject: `welcome to MERN_AUTH`,
        text: `hello world`,
        html: sendWelcomeEmailTemplete(name),
         };
        */
    //  await transporter.sendMail(mainOPtion);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      email: "see mail in spam",
      token: authToken,
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login user controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the user
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify the password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate authentication token
    const authToken = user.authToken();
    res.set("Authorization", `Bearer ${authToken}`);
    //set token i cookie
    res.cookie("x-auth-token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    //sent the user data with response
    /*
     * const userData = user.toObject();
     * delete userData.passowrd;
     */
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      // token: authToken,
      // userData : userData
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout user controller
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("x-auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    await BlackListUser.create({ token: req.token });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// Function to send a verification OTP to the authenticated user
export const sendVerifyOtp = async (req, res) => {
  const user = req.userInfo; // Get authenticated user from middleware
  const { email } = req.body; // Extract email from request body

  // Verify that the provided email matches the authenticated user’s email
  if (user.email !== email) {
    return res.status(400).json({
      // Return 400 if emails don’t match
      success: false,
      message: "Email does not match authenticated user",
    });
  }

  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate OTP expiration time (10 minutes from now, in milliseconds)
    const otpExpireTime = Date.now() + 10 * 60 * 1000;

    // Update user document with OTP and expiration
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = otpExpireTime;
    await user.save(); // Save changes to the database

    // Log OTP for testing (replace with actual email/SMS sending logic)
    console.log(
      `OTP for ${user.email}: ${otp} (expires at ${new Date(otpExpireTime)})`
    );

    await transporter.sendMail({
      // Send the OTP via email
      from: `"MERN_AUTH" ${process.env.SENDER_MAIL}`,
      to: user.email,
      subject: "Verify Your Account",
      html: OtpTemplete(user.name, otp),
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error in sendVerifyOtp:", error);
    // Return error response
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message, // Include error details
    });
  }
};

// function to verify the user otp
export const verifyOTP = async (req, res) => {
  const user = req.userInfo; // Authenticated user from middleware
  const { verifyOTP } = req.body; // OTP provided by the client

  // Validate that OTP is provided
  if (!verifyOTP) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  try {
    // Check if OTP is invalid or expired
    if (user.verifyOTP !== verifyOTP || user.verifyOTPExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update user fields in a single assignment
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    user.isAccountVerified = true;

    // Save changes to the database
    await user.save();

    // Optionally generate a new JWT token
    /*
    const newToken = user.authToken();
    res.set("Authorization", `Bearer ${newToken}`);
    res.cookie("x-auth-token", newToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    */

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
      // token: newToken, // Include if generating new token
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error in verifyOTP:", error);
    // Return detailed error response
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Provide error details for debugging
    });
  }
};

//user authencation function

export const isAuthencation = async (req, res) => {
  const token =
    req.cookies?.["x-auth-token"] || req.header.authorization.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Authorization Error",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Authencation Error",
    });
  }
};

//user reset password
export const sendVerifyPassword = async (req, res) => {
  try {
    // Extract user from request (assumes middleware attaches user to req)
    const user = req.user;

    // Check if user exists and account is verified
    if (!user || !user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your account first",
      });
    }

    // Check if OTP already exists and hasn't expired
    const hasValidOTP =
      user.resetOTP?.trim().length > 0 && user.resetOTPExpireAt > Date.now();

    if (hasValidOTP) {
      return res.status(400).json({
        success: false,
        message:
          "OTP already sent. Please check your email or wait for it to expire",
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set OTP expiration time (10 minutes from now)
    const otpExpireTime = Date.now() + 10 * 60 * 1000;

    // Update user with new OTP and expiration
    user.resetOTP = otp.toString();
    user.resetOTPExpireAt = otpExpireTime;

    // Save updated user to database
    await user.save();

    // Configure and send email with OTP
    const mailOptions = {
      from: `"MERN_AUTH" <${process.env.SENDER_MAIL}>`,
      to: user.email,
      subject: "Password Reset Verification",
      html: OtpTemplete(user.name, otp),
    };

    await transporter.sendMail(mailOptions);

    // Send success response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    // Log error for debugging (implement proper logging in production)
    console.error("Error in sendVerifyPassword:", error);

    // Return generic error response
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later",
    });
  }
};

//get the user's sented otp
export const getVerifyPassword = async (req, res) => {
  try {
  } catch (error) {}
};
