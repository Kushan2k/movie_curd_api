const router = require("express").Router();
const {
  RegisterController,
  LoginController,
} = require("../../Controllers/AuthController");

router
  .get("/", (req, res) => {
    res.send({
      msg: "lets get you registerd!",
    });
  })
  .post("/register", RegisterController)
  .post("/login", LoginController);

module.exports = router;
