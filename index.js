require("dotenv").config();
const express = require("express");
const authRoute = require("./Routes/AuthRoutes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { logger } = require("./MiddleWares/checkLogedin");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", true);

app.get("/", (req, res) => {
  if (req.cookies.accessToken) res.send({ msg: "logedin" }).end();
});

app.use("/auth", authRoute);

mongoose.connection.once("open", () => {
  console.log("Database Connected!");
  app.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
  });
});
