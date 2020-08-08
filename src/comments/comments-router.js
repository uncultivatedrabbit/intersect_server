const express = require("express");
const path = require("path");
const CommentsService = require("./comments-service");
const { requireAuth } = require("../middleware/jwt-auth");

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

commentsRouter
  .route("/")
  .get((req, res, next) => {
    CommentsService.getAllComments(req.app.get("db"))
      .then((comments) => {
        res.json(CommentsService.serializeComments(comments));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      projectId,
      newComment,
      submitterId,
      parentCommentOwnerId,
    } = req.body;
    const commentBody = {
      project_id: projectId,
      text: newComment,
      owner_id: submitterId,
      parent_comment_id: parentCommentOwnerId,
    };
    for (const [k, v] of ["projectId, newComment, submitterId"])
      if (v == null)
        return res.status(400).json({
          error: `Missing '${k}' in request body`,
        });

    CommentsService.insertComment(req.app.get("db"), commentBody)
      .then((comment) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(CommentsService.serializeComment(comment));
      })
      .catch(next);
  });

module.exports = commentsRouter;
