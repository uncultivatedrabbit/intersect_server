const xss = require("xss");
const Treeize = require("treeize");

const ProjectsService = {
  getAllProjects(db) {
    return db.select("*").from("intersect_projects");
  },
  getById(db, id) {
    return ProjectsService.getAllProjects(db).where("id", id).first();
  },
  getBySpecialty(db, specialty) {},
  deleteProject(db, id) {
    return db.from("intersect_projects").where({ id }.delete());
  },
  updateProject(db, id, newDataField) {
    return db.from("intersect_projects").where({ id }).update(newDataField);
  },
  insertProject(db, newProject) {
    return db
      .insert(newProject)
      .into("intersect_projects")
      .returning("*")
      .then((rows) => rows[0]);
  },
  serializeProjects(projects) {
    return projects.map(this.serializeProject);
  },
  serializeProject(project) {
    const projectTree = new Treeize();

    const projectData = projectTree.grow([project]).getData()[0];

    return {
      id: projectData.id,
      title: xss(projectData.title),
      summary: xss(projectData.summary),
      medical_specialty: projectData.medical_specialty,
      medical_subspecialty: xss(projectData.medical_subspecialty),
      pdf_file: projectData.pdf_file,
      date_created: projectData.date_created,
    };
  },
  serializeProjectComments(comments) {
    return comments.map(this.searlizeProjectComment);
  },
  serializeProjectComment(comment) {
    const commentTree = new Treeize();
    const commentData = commentTree.grow([comment]).getData()[0];

    return {
      id: commentData.id,
      text: xss(commentData.text),
      project_id: commentData.project_id,
      owner_id: commentData.owner_id,
      date_created: commentData.date_created,
    };
  },
};

module.exports = ProjectsService;
