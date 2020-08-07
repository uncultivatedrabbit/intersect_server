const express = require("express");
const path = require("path");
const jsonBodyParser = express.json();
const ProjectsService = require("./projects-service");
const { requireAuth } = require("../middleware/jwt-auth");
const checkProjectExists = require("./projects-utils");

const projectsRouter = express.Router();

projectsRouter
  .route("/")
  .all(requireAuth)
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
      support_needed,
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
      "support_needed",
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
      support_needed,
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
  .route("/search?")
  .all(requireAuth)
  .get((req, res, next) => {
    const { medical_specialty, medical_subspecialty } = req.query;
    ProjectsService.getBySpecialty(
      req.app.get("db"),
      medical_specialty,
      medical_subspecialty
    )
      .then((projects) => {
        res.json(ProjectsService.serializeProjects(projects));
      })
      .catch(next);
  });

projectsRouter
  .route("/:project_id")
  // .all(requireAuth)
  .all(checkProjectExists)
  .get((req, res, next) => {
    res.json(ProjectsService.serializeProject(res.project));
  })
  .delete((req, res, next) => {
    const id = res.project.id;
    ProjectsService.deleteProject(req.app.get("db"), id)
      .then((data) => {
        res.json("Data successfully deleted");
      })
      .catch(next);
  });

projectsRouter
  .route("/:project_id/comments")
  // .all(requireAuth)
  .all(checkProjectExists)
  .get((req, res, next) => {
    ProjectsService.getCommentsForProject(
      req.app.get("db"),
      req.params.project_id
    )
      .then((comments) => {
        res.json(ProjectsService.serializeProjectComments(comments));
      })
      .catch(next);
  });

module.exports = projectsRouter;
