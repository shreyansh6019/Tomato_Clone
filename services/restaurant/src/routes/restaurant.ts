import express, { Request, Response } from "express";

const router = express.Router();

import { getAllRestaurants, getRestaurantById, addRestaurant, fetchMyRestaurant, editRestaurant, updateRestaurantStatus } from "../controllers/restaurant.js";
import isAuth from "../middlewares/isAuth.js";
import { isSeller } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

//Static literal paths first
router.get("/", getAllRestaurants);
router.get("/my", isAuth, isSeller, fetchMyRestaurant);

router.patch("/edit", isAuth, isSeller, editRestaurant);
router.patch("/status", isAuth, isSeller, updateRestaurantStatus);

router.post(
  "/new",
  isAuth,
  isSeller,
  upload.single("image"),
  addRestaurant,
);

//Dynamic literal paths second
router.get("/:id", getRestaurantById);

export default router;