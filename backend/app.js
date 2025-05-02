//dependices
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Routes from "./routes/User.Routes.js";
//initialize express app
const app = express();
//default middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//api endpoinds
app.use("/users", Routes)
//export the app
export default app;
