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
      .returning("")
      .then(([user]) => user);
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
    console.log(user);
    return {
      id: userData.id,
      full_name: xss(userData.full_name),
      email: xss(userData.email),
      university_affiliation: xss(userData.university_affiliation),
      biography: xss(userData.biography),
      academic_level: xss(userData.academic_level),
      date_modified: userData.date_modified,
      date_created: new Date(userData.date_created),
    };
  },
};

module.exports = UsersService;
