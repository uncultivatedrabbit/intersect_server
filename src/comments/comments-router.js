const express = require("express");
const path = require("path");
const CommentService = require("./comments-service");
const { requireAuth } = require("../middleware/jwt-auth");

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

commentsRouter
  .route("/")
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { project_id, text } = req.body;
    const newComment = { project_id, text };
    for (const [k, v] of Object.entries(newComment))
      if (v == null)
        return res.status(400).json({
          error: `Missing '${k}' in request body`,
        });

    newComment.owner_id = req.owner_id;
    CommentService.insertComment(req.app.get("db"), newComment)
      .then((comment) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(CommentService.serializeComment(comment));
      })
      .catch(next);
  });

module.exports = commentsRouter;
