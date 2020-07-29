require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const usersRouter = require("./users/users-router");
const projectsRouter = require("./projects/projects-router");
const authRouter = require("./auth/auth-router");
const commentsRouter = require("./comments/comments-router");

const app = express();

const morganOptions = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/auth", authRouter);
app.use("/api/comments", commentsRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Server error" };
  } else {
    console.error(error);
    response = { error: error.message, object: error };
  }
  res.status(500).json(response);
});

module.exports = app;
