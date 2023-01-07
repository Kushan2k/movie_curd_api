const mongoose = require("mongoose");

const MovieShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      reuired: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    actors: {
      type: Array,
      reuired: true,
    },
    img_url: {
      type: String,
      default: null,
    },
  },
  {
    collection: "movies",
  }
);

module.exports = mongoose.model("Movie", MovieShema);
