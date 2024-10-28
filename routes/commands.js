const Schedule = require("@gefion/schedule");

Schedule.command("deleteEmptyFiles", () => {
  cache().deleteEmptyFiles();
});
