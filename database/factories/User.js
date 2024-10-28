const DB = require("@gefion/db");
const bcrypt = require("bcryptjs");

class UserFactory {
  static model = "User";

  static async definition() {
    return {
      name: faker().person.fullName(),
      email: faker().internet.email(),
      password: await bcrypt.hash("password", 8),
      isEmailVerified: false,
    };
  }
}

DB.factory(UserFactory);
