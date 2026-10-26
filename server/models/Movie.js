const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    poster: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    language: {
      type: String,
      default: "Hindi",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);