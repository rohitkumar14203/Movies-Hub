import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncMiddleware.js";

const createGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  const existingGenre = await Genre.findOne({ name });

  if (existingGenre) {
    res.status(400);
    throw new Error("Already Exists");
  }

  const genre = await Genre.create({ name });
  res.status(201).json({
    _id: genre._id,
    name: genre.name,
  });
});

const updateGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const genre = await Genre.findById({ _id: id });

  if (!genre) {
    res.status(404);
    throw new Error("Genre Not Found");
  }

  genre.name = name;
  const updatedGenre = await genre.save();
  res.status(200).json({
    _id: updatedGenre._id,
    name: updatedGenre.name,
  });
});

const removeGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const removed = await Genre.findByIdAndDelete(id);

  if (!removed) {
    res.status(404);
    throw new Error("Genre not found");
  }

  res.status(200).json(removed);
});

const allGenres = asyncHandler(async (req, res) => {
  const all = await Genre.find({});
  res.json(all);
});

const readGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404);
    throw new Error("Genre not found");
  }

  res.json(genre);
});

export { createGenre, updateGenre, removeGenre, allGenres, readGenre };
