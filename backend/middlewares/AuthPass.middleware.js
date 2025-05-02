import { validationResult } from "express-validator";
import  jwt  from 'jsonwebtoken';
import UserModel from "../models/user.model.js";

export const AuthPass = async (req, res, next) => {
  const token =
    req.cookies?.["x-auth-token"] || req.headers.authorization?.split(" ")[1];
  try {
    const isError = validationResult(req);
    if (!isError.isEmpty()) {
      return res.status(404).json({
        success: false,
        message: `${isError.array()}`,
      });
    }
    const decode  = jwt.verify(token,  process.env.JWT_SECRET)
    if(!decode){
        return res.status(400).json({
            success : false,
            message : "Unaithorize user data"
        })
    }
    const userInfo = await UserModel.findById(decode._id)
    if(!userInfo){
        return res.status(400).json({
            success : false,
            message : "Unable to reset password"
        })
    }
    req.user = userInfo
    next()
  } catch (error) {
    console.log(`Error in AuthPass : ${error}`);
    next(error);
  }
};
