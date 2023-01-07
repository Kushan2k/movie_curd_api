const jwt = require("jsonwebtoken");

const veryfyJWTMiddleWare = (req, res, next) => {
  if (!req.cookies.refreshToken) res.status(401).send({ msg: "not loged in" });
  if (req.headers.authorization || req.headers.Authorization) {
    let token = req.headers.authorization.split(" ")[1];

    try {
      let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        res.status(401).send("not valid");
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        res.status(401).send({
          msg: "token expired!",
        });
      } else {
        res.status(500).send({
          msg: "server error! maybe check if the token is valid",
        });
      }
    }
  } else {
    res.status(401).send({
      msg: "Authorization header is required!",
    });
  }
};

module.exports = { veryfyJWTMiddleWare };
