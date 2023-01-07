const router = require("express").Router();
const {
  RegisterController,
  LoginController,
  logoutController,
  NewToken,
} = require("../../Controllers/AuthController");

router
  .get("/", (req, res) => {
    if (req.cookies.accessToken) res.send({ msg: "You are logged in" });

    res.send({
      msg: "You are not logged in!",
    });
  })
  .get("/newtoken", NewToken)
  .post("/register", RegisterController)
  .post("/login", LoginController)
  .post("/logout", logoutController);

module.exports = router;
