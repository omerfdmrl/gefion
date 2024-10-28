function importTest(name, path) {
  describe(name, function () {
    require(path ? path : `./vendor/${name}/${name}.js`);
  });
}

describe("Top", async function () {
  await require("../index");
  importTest("Router");
  importTest("Hook");
  importTest("Error");
  importTest("Schedule");
  importTest("Validator");
  importTest("Database");
});
