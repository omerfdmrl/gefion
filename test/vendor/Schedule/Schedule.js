const chai = require("chai");
let Schedule,
  scheduled = false,
  task;

before(function () {
  Schedule = require("@gefion/schedule");
  Schedule.stop;
});

it("command", function () {
  const command = Schedule.command("test", function () {
    scheduled = true;
  });
  chai.expect(command).not.to.be.NaN;
});

it("schedule", async function () {
  task = Schedule.schedule("* * * * * *", function () {
    scheduled = true;
  });
  await new Promise((resolve) => setTimeout(resolve, 1001));
  chai.expect(scheduled).to.be.true;
});

it("stop", function () {
  const command = task.stop();
  chai.expect(command).to.be.undefined;
});
