import express from "express";

import {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

import { protect, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(createUser).get(protect, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);

router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getCurrentUserProfile)
  .put(protect, updateCurrentUserProfile);

export default router;
