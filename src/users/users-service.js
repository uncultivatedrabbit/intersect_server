const xss = require("xss");
const bcrypt = require("bcryptjs");
const Treeize = require("treeize");

const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getAllUsers(db) {
    return db
      .from("intersect_users as usr")
      .select(
        "usr.id",
        "usr.full_name",
        "usr.email",
        "usr.university_affiliation",
        "usr.biography",
        "usr.academic_level"
      );
  },
  getUserById(db, id) {
    return UsersService.getAllUsers(db).where("id", id).first();
  },
  getProjectsForUser(db, user_id) {
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
    )
    .where("proj.owner_id", user_id)
    .rightJoin("intersect_users AS usr", "proj.owner_id", "usr.id")
    .groupBy("proj.id", "usr.id");
  },
  hasUserWithEmail(db, email) {
    return db("intersect_users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("intersect_users")
      .returning("*")
      .then(([user]) => user);
  },
  updateUser(db, id, newDataField) {
    return db("intersect_users").where({ id }).update(newDataField);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be fewer than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!regex.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUsers(users) {
    return users.map(this.serializeUser);
  },
  serializeUser(user) {
    const userTree = new Treeize();

    const userData = userTree.grow([user]).getData()[0];
    return {
      id: userData.id,
      full_name: xss(userData.full_name),
      email: xss(userData.email),
      university_affiliation: xss(userData.university_affiliation),
      biography: xss(userData.biography),
      academic_level: xss(userData.academic_level),
    };
  },
};

const userFields = [
  "usr.id AS user:id",
  "usr.full_name AS user:full_name",
  "usr.email AS user:email",
  "usr.university_affiliation AS user:university_affiliation",
  "usr.academic_level AS user:academic_level",
];

module.exports = UsersService;
