import express from "express";

const router = express.Router();

import { protect, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createGenre,
  updateGenre,
  removeGenre,
  allGenres,
  readGenre,
} from "../controllers/genreController.js";

router.route("/").post(protect, authorizeAdmin, createGenre);

router.get("/genres", allGenres);

router
  .route("/:id")
  .put(protect, authorizeAdmin, updateGenre)
  .delete(protect, authorizeAdmin, removeGenre)
  .get(readGenre);

export default router;
