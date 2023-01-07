const Router = require("express").Router();
const {
  getAllMoviesController,
  getMovieController,
  addMovie,
} = require("../../Controllers/MovieController");

Router.get("/", getAllMoviesController)
  .get("/:id", getMovieController)
  .post("/create", addMovie);

module.exports = Router;
