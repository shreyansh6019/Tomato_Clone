import express from "express";

const router = express.Router();

import { getAllMenuItems, getMenuItemById, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from "../controllers/menuItem.js";
import isAuth from "../middlewares/isAuth.js";
import { isSeller } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

//Static literal paths first
router.get("/all/:id", isAuth, getAllMenuItems);

router.get("/:id", isAuth, getMenuItemById);

router.post(
  "/new",
  isAuth,
  isSeller,
  upload.single("image"),
  addMenuItem,
);

router.patch("/edit/:itemId", isAuth, isSeller, updateMenuItem);
router.delete("/delete/:itemId", isAuth, isSeller, deleteMenuItem);
router.patch("/status/:itemId", isAuth, isSeller, toggleMenuItemAvailability);

export default router;