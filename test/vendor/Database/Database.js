const chai = require("chai");
let DB, TestSchema, TestModel, ID;

before(async function () {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  DB = require("@gefion/db");
  TestSchema = new DB.Schema({
    key: {
      type: String,
      required: true,
      validate: "string",
    },
    value: {
      type: Number,
      required: true,
      validate: "number",
    },
  });
  TestModel = new DB.Model("Test", TestSchema);
});

it("insertion", async function () {
  try {
    ID = await TestModel.insert({ value: "bar", key: "foo" });
  } catch (error) {
    chai.assert.fail();
  }
});
it("validation", async function () {
  try {
    await TestModel.insert({ key: "foo" });
    chai.assert.fail();
  } catch (error) {}
});
it("deletion", async function () {
  try {
    await ID.delete();
  } catch (error) {
    chai.assert.fail();
  }
});
