const chai = require("chai");
let Error;

before(function () {
  Error = require("@gefion/error");
});

it("throw name and message", function () {
  try {
    new Error.BadRequestError("Bad");
  } catch (error) {
    chai.expect(error.name).to.be.eq("BadRequestError");
    chai.expect(error.message).to.be.eq("Bad Request: Bad");
  }
});
