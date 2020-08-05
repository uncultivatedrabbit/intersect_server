const express = require("express");
const path = require("path");
const UsersService = require("./users-service");
const ProjectService = require("../projects/projects-service");
const checkUserExists = require("./users-utils");
const usersRouter = express.Router();
const jsonBodyParser = express.json();
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");

usersRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((users) => {
        res.json(users);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { password, full_name, email } = req.body;

    for (const field of ["full_name", "password", "email"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field} in request body`,
        });
      }
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    UsersService.hasUserWithEmail(req.app.get("db"), email).then(
      (hasUserWithEmail) => {
        if (hasUserWithEmail) {
          return res.status(400).json({ error: "Email already taken" });
        }
        return UsersService.hashPassword(password).then((hashedPassword) => {
          const newUser = {
            email,
            password: hashedPassword,
            full_name,
            date_created: "now()",
          };
          return UsersService.insertUser(req.app.get("db"), newUser)
            .then((user) =>
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user))
            )
            .catch(next);
        });
      }
    );
  });

usersRouter
  .route("/:user_id")
  .all(checkUserExists)
  .all(requireAuth)
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    if (Object.keys(req.body).length !== 2) {
      return res.status(400).json({
        error: `Missing data in request body`,
      });
    }
    const { id } = req.body;

    const category = Object.keys(req.body)[1];
    const updatedData = { [category]: xss(Object.values(req.body)[1]) };
    UsersService.updateUser(req.app.get("db"), id, updatedData).then((data) => {
      res.status(201).location("/");
    });
  });

usersRouter
  .route("/:user_id/projects")
  .all(requireAuth)
  .all(checkUserExists)
  .get((req, res, next) => {
    UsersService.getProjectsForUser(req.app.get("db"), req.params.user_id)
      .then((projects) => {
        res.json(ProjectService.serializeProjects(projects));
      })
      .catch(next);
  });

module.exports = usersRouter;
