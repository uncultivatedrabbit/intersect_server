const ProjectService = require("./projects-service");

async function checkProjectExists(req, res, next) {
  try {
    const project = await ProjectService.getById(
      req.app.get("db"),
      req.params.project_id
    );

    if (!project) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }
    res.project = project;
  } catch (error) {
    next(error);
  }
}

module.exports = checkProjectExists

