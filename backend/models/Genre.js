import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      maxLength: 32,
    },
  },
  { timestamps: true }
);

const Genre = mongoose.model("Genre", genreSchema);

export default Genre;
