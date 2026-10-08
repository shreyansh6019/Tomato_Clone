import express, { Request, Response } from "express";

const router = express.Router();

import { getAllRestaurants, getRestaurantById, addRestaurant } from "../controllers/restaurant.js";
import isAuth from "../middlewares/isAuth.js";
import { isSeller } from "../middlewares/isAuth.js";

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

router.post(
  "/new",
  isAuth,
  isSeller,
  addRestaurant,
);

export default router;