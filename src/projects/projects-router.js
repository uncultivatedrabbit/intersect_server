const express = require("express");
const ProjectsService = require("./projects-service");
const { requireAuth } = require("../middleware/jwt-auth");
const checkProjectExists = require("./projects-utils");

const projectsRouter = express.Router();

projectsRouter.route("/").get((req, res, next) => {
  ProjectsService.getAllProjects(req.app.get("db"))
    .then((projects) => {
      res.json(ProjectsService.serializeProjects(projects));
    })
    .catch(next);
});

projectsRouter
  .route("/:project_id")
  .all(requireAuth)
  .all(checkProjectExists)
  .get((req, res) => {
    res.json(ProjectsService.serializeProject(res.project));
  });

projectsRouter
  .route("/:project_id/comments")
  .all(requireAuth)
  .all(checkProjectExists)
  .get((req, res) => {
    ProjectsService.getCommentsForProject(
      req.app.get("db"),
      req.params.project_id
    )
      .then((comments) => {
        res.json(ProjectsService.seralizeProjectComments(comments));
      })
      .catch(next);
  });

module.exports = projectsRouter;
