const UsersService = require("./users-service");

async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getUserById(
      req.app.get("db"),
      req.params.user_id
    );

    if (!user)
      return res.status(404).json({
        error: `User doesn't exist`,
      });

    res.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = checkUserExists;
