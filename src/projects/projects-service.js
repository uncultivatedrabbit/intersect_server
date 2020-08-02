const xss = require("xss");
const Treeize = require("treeize");

const ProjectsService = {
  getAllProjects(db) {
    return db
      .from("intersect_projects as proj")
      .select(
        "proj.id",
        "proj.title",
        "proj.summary",
        "proj.medical_specialty",
        "proj.medical_subspecialty",
        "proj.irbstatus",
        "proj.date_created",
        ...userFields,
        db.raw(
          `count(DISTINCT com) AS number_of_comments`
        )
      )
      .leftJoin('intersect_project_comments AS com', 'proj.id', "com.project_id")
      .leftJoin("intersect_users AS usr", "proj.owner_id", "usr.id")
      .groupBy("proj.id", "usr.id");
  },
  getById(db, id) {
    return ProjectsService.getAllProjects(db).where("proj.id", id).first();
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
      irbstatus: xss(projectData.irbstatus),
      date_created: projectData.date_created,
      owner_id: projectData.owner_id,
      ...projectData,
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

const userFields = [
  "usr.id AS user:id",
  "usr.full_name AS user:full_name",
  "usr.email AS user:email",
  "usr.university_affiliation AS user:university_affiliation",
  "usr.academic_level AS user:academic_level",
  "usr.biography AS user:biography",
];

module.exports = ProjectsService;
