import express from "express";
import {
  isAuthencation,
  loginUser,
  logoutUser,
  registerUser,
  sendVerifyOtp,
  verifyOTP,
  sendVerifyPassword
} from "../controllers/User.controller.js";
import { AuthUserRegistation } from "../middlewares/AuthUserRegistation.middlwrares.js";
import { AuthUserLogin } from "../middlewares/AuthUserLogin.middleware.js";
import { AuthUserLogout } from "../middlewares/AuthUserLogout.middleware.js";
import { AuthUserVerify } from "../middlewares/AuthUserVerify.middleware.js";
import { AuthUserOtp } from "../middlewares/AuthUserOtp.middleware.js";
import { AuthPass } from "../middlewares/AuthPass.middleware.js";

//create a router
const Routes = express.Router();

//user registation routes
Routes.post("/api/register", AuthUserRegistation, registerUser);
//user login routes
Routes.post("/api/login", AuthUserLogin, loginUser);
//user logout routes
Routes.post("/api/logout", AuthUserLogout, logoutUser);
//sentverifyOtp
Routes.post("/api/sent-verify-otp", AuthUserVerify, sendVerifyOtp);
//verify OTP
Routes.post("/api/otp-verify-account", AuthUserOtp, verifyOTP);

//check is user is authentic
Routes.post("/api/is-auth",  isAuthencation);
//sent verify reset otp route
Routes.post("/api/otp-password",AuthPass,sendVerifyPassword)
//get and verify the top
Routes.post("/api/otp-password-verify",AuthPass,)

//export the router
export default Routes;
