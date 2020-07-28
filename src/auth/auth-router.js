const express = require("express");
const AuthService = require("./auth-service");
const { json } = require("express");
const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post("/login", jsonBodyParser, (req, res, next) => {
  const { email, password } = req.body;
  const loginUser = { email, password };

  for (const [k, v] of Object.entries(loginUser)) {
    if (v === null) {
      return res.status(400).json({
        error: `Missing ${k} in request body`,
      });
    }
  }

  AuthService.getUserWithEmail(req.app.get("db"), loginUser.email)
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: "Incorrect username or password",
        });
      }
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch) {
          return res.status(400).json({
            error: "Incorrect username or password",
          });
        }
        const sub = dbUser.email;
        const payload = { user_id: dbUser.id };
        res.send({ authToken: AuthService.createJwt(sub, payload) });
      });
    })
    .catch(next);
});

module.exports = authRouter;
