const ConsoleKernel = require("@gefion/console-kernel");

/**
 * Custom Kernel class for the application's console commands and scheduling.
 * @class
 * @extends ConsoleKernel
 * @example <caption>Load Commands</caption>
 * this.commands("commands");// /routes/commands.js
 * @example <caption>Schedule Command</caption>
 * this.schedule('* * * * *', 'deleteEmptyFiles'); // Call deleteEmptyFiles command every minute
 */
module.exports = class Kernel extends ConsoleKernel {
  constructor() {
    super();
    this.scheduler();
  }

  scheduler() {
    this.commands("commands");
    this.schedule("* * * * *", "deleteEmptyFiles");
  }
};
