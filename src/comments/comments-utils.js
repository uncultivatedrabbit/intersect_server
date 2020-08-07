const CommentsService = require("./comments-service");

async function checkCommentExists(req, res, next) {
  try {
    const comment = await CommentsService.getById(
      req.app.get("db"),
      req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment doesn't exist" });
    }
    res.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = checkCommentExists

