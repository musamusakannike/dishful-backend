const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const middlewares = require("./middlewares");
const connectDB = require("./config/db");

const authRoute = require("./routes/auth.route")
const recipeRoute = require("./routes/recipe.route");
const { authenticate } = require("./middlewares/authMiddleware");

connectDB();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎SERVER IS LIVE🌏✨🌈🦄",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/recipe", authenticate, recipeRoute);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
