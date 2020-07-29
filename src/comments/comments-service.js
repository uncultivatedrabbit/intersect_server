const xss = require("xss");

const CommentService = {
  getById(db, id) {
    return db.from("intersect_comments").select("*").where("id", id).first();
  },
  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into("intersect_comments")
      .returning("*")
      .then(([comment]) => comment)
      .then((comment) => CommentService.getById(db, comment.id));
  },
  serializeComment(comment) {
    return {
      id: comment.id,
      text: xss(comment.text),
      project_id: comment.project_id,
      owner_id: comment.owner_id,
      date_created: comment.date_created,
    };
  },
};

module.exports = CommentService;
