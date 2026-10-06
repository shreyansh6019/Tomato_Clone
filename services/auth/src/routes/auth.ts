import express from "express";
import { loginUser, addUserRole, myProfile } from "../controllers/auth.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/add/role").put(isAuth,addUserRole);
router.route("/profile").get(isAuth, myProfile);

export default router;