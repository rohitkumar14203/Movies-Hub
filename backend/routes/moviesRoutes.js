import express from "express";

import { authorizeAdmin, protect } from "../middlewares/authMiddleware.js";
import { checkId } from "../middlewares/checkId.js";
import {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  movieReview,
  updateMovie,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
} from "../controllers/movieController.js";
const router = express.Router();

// Public Routes

router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);

// Login User Routes
router.post("/:id/reviews", protect, checkId, movieReview);

// Admin Routes
router.post("/create-movie", protect, authorizeAdmin, createMovie);
router.put("/update-movie/:id", protect, authorizeAdmin, updateMovie);
router.delete("/delete-movie/:id", protect, authorizeAdmin, deleteMovie);
router.delete("/delete-comment", protect, authorizeAdmin, deleteComment);
export default router;
