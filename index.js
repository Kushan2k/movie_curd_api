require("dotenv").config();
const express = require("express");
const authRoute = require("./Routes/AuthRoutes");
const movieRoutes = require("./Routes/MovieRoutes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { veryfyJWTMiddleWare } = require("./MiddleWares/checkLogedin");

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

app.get("/", veryfyJWTMiddleWare, (req, res) => {
  res.send(req.user);
});

app.use("/auth", authRoute);
app.use("/movies", veryfyJWTMiddleWare, movieRoutes);

mongoose.connection.once("open", () => {
  console.log("Database Connected!");
  app.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
  });
});
