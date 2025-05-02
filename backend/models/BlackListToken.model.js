import mongoose from "mongoose";

const BlackListToken = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Automatically delete documents after 24 hours (86400 seconds)
  },
});

const BlackListUser =
  mongoose.model.BlackListToken ||
  mongoose.model("BlackListToken", BlackListToken);
export default BlackListUser;
