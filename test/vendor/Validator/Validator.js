const chai = require("chai");
let Validator;

before(function () {
  Validator = require("@gefion/validator");
});
it("required", function () {
  chai.expect(Validator.required(undefined)).to.be.false;
  chai.expect(Validator.required(true)).to.be.true;
});
it("array", function () {
  chai.expect(Validator.array(12)).to.be.false;
  chai.expect(Validator.array([1, 2])).to.be.true;
});
it("string", function () {
  chai.expect(Validator.string(12)).to.be.false;
  chai.expect(Validator.string("foo")).to.be.true;
});
it("numeric", function () {
  chai.expect(Validator.numeric("foo")).to.be.false;
  chai.expect(Validator.numeric(12)).to.be.true;
});
it("integer", function () {
  chai.expect(Validator.integer("foo")).to.be.false;
  chai.expect(Validator.integer(12)).to.be.true;
});
it("object", function () {
  chai.expect(Validator.object("foo")).to.be.false;
  chai.expect(Validator.object({ 1: 2 })).to.be.true;
});
it("boolean", function () {
  chai.expect(Validator.boolean("foo")).to.be.false;
  chai.expect(Validator.boolean(true)).to.be.true;
});
it("function", function () {
  chai.expect(Validator.function("foo")).to.be.false;
  chai.expect(Validator.function(function () {})).to.be.true;
});
it("min", function () {
  chai.expect(Validator.min(2, 3)).to.be.false;
  chai.expect(Validator.min(2, 1)).to.be.true;
});
it("max", function () {
  chai.expect(Validator.max(2, 1)).to.be.false;
  chai.expect(Validator.max(2, 3)).to.be.true;
});
it("email", function () {
  chai.expect(Validator.email("foo")).to.be.false;
  chai.expect(Validator.email("foo@bar.com")).to.be.true;
});
it("in", function () {
  chai.expect(Validator.in("a", "b,c,d")).to.be.false;
  chai.expect(Validator.in("a", "a,b,c")).to.be.true;
});
it("(lower+upper)case", function () {
  chai.expect(Validator.lowercase("foo")).to.be.true;
  chai.expect(Validator.lowercase("FoO")).to.be.false;
  chai.expect(Validator.uppercase("BAR")).to.be.true;
  chai.expect(Validator.uppercase("BaR")).to.be.false;
});
it("match", function () {
  chai.expect(Validator.match("acb", "abc*")).to.be.false;
  chai.expect(Validator.match("abc", "abc*")).to.be.true;
});
it("validating in string format", function () {
  const validated = Validator.validate("abc", "string");
  chai.expect(validated.failed()).to.be.false;
});
it("validating in json format", function () {
  const validated = Validator.validate({ key: "abc" }, { key: "string" });
  chai.expect(validated.failed()).to.be.false;
});
it("validating in nested json format", function () {
  const validated = Validator.validate(
    { key: { key: "abc" } },
    { key: { key: "string" } }
  );
  chai.expect(validated.failed()).to.be.false;
});
