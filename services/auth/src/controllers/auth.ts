import { User } from "../model/User.js";
import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import oAuth2Client from "../config/googleConfig.js";
import axios from "axios";

import jwt from "jsonwebtoken";

export const loginUser = TryCatch(async (req, res) => {
  console.log("Login user called", req.body);
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Authorization code is required" });
  }

  const googleTokenResponse = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(googleTokenResponse.tokens);
  const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleTokenResponse.tokens.access_token}`);
  const { email, name, picture } = userInfoResponse.data;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ username: name, email, image: picture });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
    user,
  });
});

const allowedRoles = ["customer", "rider", "seller"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async (req: AuthenticatedRequest, res) => {
  console.log("Add user role called", req.body);
  if (!req.user?._id) {
    return res.status(400).json({ message: "User not found" });
  }

  const { role } = req.body as { role: Role };

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role },
    { returnDocument: 'after' }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });
  res.status(200).json({
    message: "User role updated successfully",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
});