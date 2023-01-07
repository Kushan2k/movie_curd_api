const bCrypt = require("bcrypt");
const jwttoken = require("jsonwebtoken");
const UserModel = require("../Models/User.Model");

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
    res.status(500).send({
      msg: "error",
    });
  }
};

const LoginController = async (req, res) => {
  if (req.cookies.refreshToken) {
    res.status(200).send({ msg: "You are aready logged in!" });
  }

  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
  }).exec();

  if (user == null)
    res.status(401).send({
      msg: "unauthorized!",
    });

  const match = await bCrypt.compare(password, user.password);

  if (!match)
    res.status(401).send({
      msg: "Passwords don't match",
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
      expiresIn: "300s",
    }
  );
  user.refreshToken = refreshToken;
  try {
    await user.save();
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  } catch (e) {
    res.status(500).send({
      msg: "could not create refersh token",
    });
  }
};

const logoutController = (req, res) => {
  req.clearCookie("refreshToken", {
    httpOnly: true,
  });
  res.status(200).send({ msg: "you have been loged out!" });
};

const NewToken = (req, res) => {
  if (req.cookies.refreshToken) {
    const token = requestNewToken(req.cookies.refreshToken);
    return token === null
      ? res.status(401).send({ msg: "unauthorized" })
      : res.status(201).send({ accessToken: token });
  } else {
    res.status(401).send({
      msg: "Not authorized!",
    });
  }
};

const requestNewToken = async (Token) => {
  const user = await UserModel.findOne({
    refreshToken: Token,
  }).exec();
  if (!user) return null;

  let newAccesstoken = jwttoken.sign(
    {
      username: user.username,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "200s",
    }
  );
  return newAccesstoken;
};

module.exports = {
  RegisterController,
  LoginController,
  logoutController,
  NewToken,
};
