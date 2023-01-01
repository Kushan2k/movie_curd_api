const bCrypt = require("bcrypt");
const UserModel = require("../Models/User.Model");
const jwttoken = require("jsonwebtoken");

const RegisterController = async (req, res) => {
  const { username, password, email } = req.body;

  const foundUser = await UserModel.findOne({
    username: username,
    email: email,
  }).exec();
  if (foundUser != null) return;

  const hash = await bCrypt.hash(password, 20);

  try {
    const user = await UserModel.create({
      username: username,
      password: hash,
      email: email,
    });

    res.send(user);
  } catch (e) {
    res.sendStatus(500).send({
      msg: "error",
    });
  }
};

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
  }).exec();

  if (user == null)
    res.sendStatus(401).send({
      msg: "unauthorized!",
    });

  const match = await bCrypt.compare(password, user.password);

  if (!match)
    res.sendStatus(401).send({
      msg: "unauthorized!",
    });
  const refreshToken = jwttoken.sign(
    {
      username: user.username,
      email: user.email,
    },
    process.env.REFESH_TOKEN_KEY
  );
  const accessToken = jwttoken.sign(
    {
      username: user.username,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "60s",
    }
  );
  user.refreshToken = refreshToken;
  try {
    await user.save();
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });

    res.send({ accessToken });
  } catch (e) {
    res.sendStatus(500).send({
      msg: "could not create refersh token",
    });
  }
};

module.exports = { RegisterController, LoginController };
