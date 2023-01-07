const Router = require("express").Router();
const { getAllMoviesController } = require("../../Controllers/MovieController");

Router.get("/", getAllMoviesController).get("/:id", (req, res) => {});

module.exports = Router;
