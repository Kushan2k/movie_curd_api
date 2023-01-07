const MovieModel = require("../Models/Movie.Model");
const getAllMoviesController = async (req, res) => {
  const movies = await MovieModel.find({});
  res.status(200).send({
    status: "Ok",
    msg: movies,
  });
};

const getMovieController = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await MovieModel.findById(id).exec();

    if (!movie) res.status(200).send({ msg: "No movies found" });

    res.status(200).send({
      status: "OK",
      movie: movie,
    });
  } catch (e) {
    res.status(200).send({
      status: "error",
      msg: e,
    });
  }
};

const addMovie = async (req, res) => {
  const { name, ratings, actors, img_url, year } = req.body;
  console.log(req.body);

  if (
    !name ||
    !ratings ||
    !actors ||
    !Array.isArray(actors.split(",")) ||
    !img_url ||
    !year
  )
    res.status(301).send({ msg: "please provid all the fileds" });

  try {
    const movie = await MovieModel.create({
      name: name,
      ratings: ratings,
      actors: actors.split(","),
      img_url: img_url,
      year: year,
    });

    movie.save();
    res.status(201).send({
      msg: "created!",
      movie: movie,
    });
  } catch (e) {
    res.status(200).send({
      msg: "error in creating!",
    });
  }
};

module.exports = { getAllMoviesController, getMovieController, addMovie };
