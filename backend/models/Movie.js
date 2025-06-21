import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // reviewer name
    rating: { type: Number, required: true }, // rating given
    comment: { type: String, required: true }, // review text
    user: {
      type: mongoose.Schema.Types.ObjectId, // reference to User
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // movie name
    image: { type: String }, // poster image URL
    year: { type: Number, required: true }, // release year
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    }, // link to Genre
    detail: { type: String, required: true }, // description
    cast: [{ type: String }], // list of actors
    reviews: [reviewSchema], // embedded reviews
    numReviews: { type: Number, required: true, default: 0 }, // total number of reviews
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
