const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User.Model");

const logger = (req, res, next) => {
  if (!req.cookies.accessToken) res.send({ msg: "loged in" });
  next();
};

module.export = { logger };
