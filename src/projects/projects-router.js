const express = require("express");
const path = require("path");
const jsonBodyParser = express.json();
const ProjectsService = require("./projects-service");
const { requireAuth } = require("../middleware/jwt-auth");
const checkProjectExists = require("./projects-utils");

const projectsRouter = express.Router();

projectsRouter
  .route("/")
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get("db"))
      .then((projects) => {
        res.json(ProjectsService.serializeProjects(projects));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {
      owner_id,
      title,
      summary,
      IrbStatus: irbstatus,
      specialty: medical_specialty,
      subspecialty: medical_subspecialty,
    } = req.body;

    for (const field of [
      "owner_id",
      "title",
      "summary",
      "IrbStatus",
      "title",
      "specialty",
    ]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field} in request body`,
        });
      }
    }
    const newProject = {
      owner_id,
      title,
      summary,
      irbstatus,
      medical_specialty,
      medical_subspecialty,
      date_created: "now()",
    };
    return ProjectsService.insertProject(req.app.get("db"), newProject).then(
      (project) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${project.id}`))
          .json(ProjectsService.serializeProject(project));
      }
    );
  });

projectsRouter
  .route("/:project_id")
   // .all(requireAuth)
  .all(checkProjectExists)
  .get((req, res, next) => {
    res.json(ProjectsService.serializeProject(res.project));
  });

projectsRouter
  .route("/:project_id/comments")
  // .all(requireAuth)
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
