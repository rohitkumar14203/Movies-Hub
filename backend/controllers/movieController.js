import asyncHandler from "../middlewares/asyncMiddleware.js";
import Movie from "../models/Movie.js";

// @des Admin-Route "/create-movie"
const createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(200).json(movie);
});

// @des Admin-Route "/update-movie/:id"
const updateMovie = asyncHandler(async (req, res) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedMovie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.json(updatedMovie);
});

// @des Admin-Route "/delete-movie/:id"
const deleteMovie = asyncHandler(async (req, res) => {
  const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deleteMovie) {
    return res.status(404).json({ message: "Movie Not Found" });
  }

  res.status(200).json({ message: "movie deleted successfully" });
});

// @des Admin-Route "/delete-comment"
const deleteComment = asyncHandler(async (req, res) => {
  // Extract movieId and reviewId from request body
  const { movieId, reviewId } = req.body;

  // Find the movie in the database using its ID
  const movie = await Movie.findById(movieId);

  // If movie not found, send a 404 response
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  // Find the index of the review in the movie's reviews array
  const reviewIndex = movie.reviews.findIndex(
    (r) => r._id.toString() === reviewId
  );

  // If review not found in the array, send a 404 response
  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Remove the review from the array using splice
  movie.reviews.splice(reviewIndex, 1);

  // Update the total number of reviews
  movie.numReviews = movie.reviews.length;

  // Recalculate the movie's average rating
  movie.rating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length
      : 0;

  // Save the updated movie document back to the database
  await movie.save();

  // Send a success response
  res.json({ message: "Comment Deleted Successfully" });
});

// login user Route
// @des user-Route "/:id/reviews"
const movieReview = asyncHandler(async (req, res) => {
  // Step 1: Extract 'rating' and 'comment' from the request body sent by the user
  // This is the data user submits to review the movie
  const { rating, comment } = req.body;

  // Step 2: Find the movie in the database by the ID provided in URL parameter
  // req.params.id contains the movie's unique ID
  // Movie.findById returns the movie document or null if not found
  const movie = await Movie.findById(req.params.id);

  // Step 3: If movie is not found in the database, return a 404 error response
  // This means the movie does not exist or ID is invalid
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  // Step 4: Check if the logged-in user has already reviewed this movie
  // movie.reviews is an array of review objects for this movie
  // We compare each review's 'user' (ObjectId) with current user's ID to find duplicates
  // We convert both IDs to string for accurate comparison
  const alreadyReviewed = movie.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  // Step 5: If user already reviewed, return 400 Bad Request to prevent duplicate reviews
  // This is to enforce the rule: one user can review a movie only once
  if (alreadyReviewed) {
    return res.status(400).json({ message: "Movie already reviewed" });
  }

  // Step 6: Prepare a new review object with details:
  // - name: the username of the reviewer (from authenticated user)
  // - rating: the numeric rating given by user (converted to Number)
  // - comment: the text comment/review by user
  // - user: the ObjectId of the reviewer (to track who wrote the review)
  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  // Step 7: Add the new review to the movie's reviews array
  movie.reviews.push(review);

  // Step 8: Update the total number of reviews for this movie
  // Simply the length of the reviews array after adding new review
  movie.numReviews = movie.reviews.length;

  // Step 9: Calculate the average rating for the movie based on all reviews
  // We sum up all ratings using reduce and divide by total number of reviews
  // This gives the current average rating after adding the new review
  movie.rating =
    movie.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / movie.reviews.length;

  // Step 10: Save the updated movie document back to the database
  // This persists the new review, updated number of reviews, and new average rating
  await movie.save();

  // Step 11: Send a success response with HTTP status 201 (Created)
  // Also send a simple message indicating the review was added successfully
  res.status(201).json({ message: "Review Added" });
});

// @des Public-Route "/all-movies"
const getAllMovies = asyncHandler(async (req, res) => {
  const find = await Movie.find({});

  res.status(200).json(find);
});

// @des Public-Route "/specific-movies/:id"
const getSpecificMovie = asyncHandler(async (req, res) => {
  const findMovie = await Movie.findById(req.params.id);

  if (!findMovie) {
    res.status(404).json({ message: "Movie not found" });
  }

  res.status(200).json(findMovie);
});

const getNewMovies = asyncHandler(async (req, res) => {
  const newMovies = await Movie.find().sort({ createAt: -1 }).limit(10);
  res.status(200).json(newMovies);
});

const getTopMovies = asyncHandler(async (req, res) => {
  const topRatedMovies = await Movie.find().sort({ numReviews: -1 }).limit(10);

  res.status(200).json({ topRatedMovies });
});

const getRandomMovies = asyncHandler(async (req, res) => {
  const randomMovies = await Movie.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).json({ randomMovies });
});

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
