const chai = require("chai");
let Hook;

before(function () {
  Hook = require("@gefion/hook");
});

it("add", function () {
  const hook = Hook.add("test", (data) => {
    data += 1;
    return data;
  });
  chai.expect(hook).to.be.true;
});

it("do", function () {
  const hook = Hook.do("test", 5);
  chai.expect(hook).to.be.eq(6);
});

it("remove", function () {
  const hook = Hook.remove("test");
  chai.expect(hook).to.be.true;
});

it("priority", function () {
  Hook.add(
    "test2",
    (data) => {
      data += "r";
      return data;
    },
    1
  );
  Hook.add(
    "test2",
    (data) => {
      data += "b";
      return data;
    },
    3
  );
  Hook.add(
    "test2",
    (data) => {
      data += "a";
      return data;
    },
    2
  );
  const hook = Hook.do("test2", "");
  chai.expect(hook).to.be.eq("bar");
});
