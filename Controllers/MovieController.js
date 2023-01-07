const MovieModel = require("../Models/Movie.Model");
const getAllMoviesController = async (req, res) => {
  const movies = await MovieModel.find({});
  console.log(movies);

  res.status(200).send({
    msg: movies,
  });
};

module.exports = { getAllMoviesController };
