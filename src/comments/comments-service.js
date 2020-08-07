const xss = require("xss");

const CommentsService = {
  getAllComments(db){
    return db.from('intersect_project_comments').select("*")
  },
  getById(db, id) {
    return db.from("intersect_project_comments").select("*").where("id", id).first();
  },
  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into("intersect_project_comments")
      .returning("*")
      .then(([comment]) => comment)
      .then((comment) => CommentService.getById(db, comment.id));
  },
  serializeComments(comments) {
    return comments.map(this.serializeComment);
  },
  serializeComment(comment) {
    return {
      id: comment.id,
      text: xss(comment.text),
      project_id: comment.project_id,
      owner_id: comment.owner_id,
      date_created: comment.date_created,
      parent_comment_id: comment.parent_comment_id
    };
  },
};

module.exports = CommentsService;
