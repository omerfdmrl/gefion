const { Table } = require("console-table-printer");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = class Plox {
  static #argv = process.argv.slice(2);
  static #commands = {
    "make:controller": (name) => {
      if (!name) return this.#error("Undefined controller name");
      const data = this.#templates.controller.default;
      const path = `${this.#paths.controller}${name}.js`;
      if (fs.existsSync(path)) {
        return this.#error("Controller Already Exists");
      }
      fs.writeFileSync(path, data);

      this.#success("Controller Created");
    },
    "make:model": (name) => {
      if (!name) return this.#error("Undefined model name");
      const data = this.#templates.model.default.replaceAll(":name:", name);
      const path = `${this.#paths.model}${name}.js`;
      if (fs.existsSync(path)) {
        return this.#error("Model Already Exists");
      }
      fs.writeFileSync(path, data);

      this.#success("Model Created");
    },
    "make:validation": (name) => {
      if (!name) return this.#error("Undefined validation name");
      const data = this.#templates.validation.default;
      const path = `${this.#paths.validation}${name}.js`;
      if (fs.existsSync(path)) {
        return this.#error("Validation Already Exists");
      }
      fs.writeFileSync(path, data);

      this.#success("Validation Created");
    },
    "make:job": (name) => {
      if (!name) return this.#error("Undefined job name");
      var template = this.#checkArgv({
        argv: "--template=",
        split: "=",
      });
      if (!this.#templates.job[template]) {
        template = "default";
      }

      const data = this.#templates.job[template].replaceAll(":name:", name);
      const path = `${this.#paths.job}${name}.js`;
      if (fs.existsSync(path)) {
        return this.#error("Job Already Exists");
      }
      fs.writeFileSync(path, data);

      this.#success("Job Created");
    },
    "make:worker": (name) => {
      if (!name) return this.#error("Undefined worker name");

      const data = this.#templates.worker.default;
      const path = `${this.#paths.worker}${name}.js`;
      if (fs.existsSync(path)) {
        return this.#error("Worker Already Exists");
      }
      fs.writeFileSync(path, data);

      this.#success("Worker Created");
    },
    add: async (name) => {
      if (!name) return this.#error("Undefined name");

      if (!this.#checkPackage(name)) {
        this.#error("Extension doesn't exists");
        await exec(`npm i ${name}`);
      }

      const fileContent = fs.readFileSync(this.#paths.extensions, "utf-8");
      const lines = fileContent.split("\n");
      const searchLine = `require("${name}");`;

      const exists = lines.includes(searchLine);

      if (exists) return this.#error("Extension already exists");

      fs.appendFileSync(this.#paths.extensions, searchLine);
      return this.#success("Extension added");
    },
    remove: (name) => {
      if (!name) return this.#error("Undefined name");
      const fileContent = fs.readFileSync(this.#paths.extensions, "utf-8");
      const lines = fileContent.split("\n");
      const searchLine = `require("${name}");`;

      const exists = lines.includes(searchLine);

      if (!exists) return this.#error("Extension not exists");

      const newContent = lines.filter(
        (line, index) => index !== lines.indexOf(searchLine)
      );

      fs.writeFileSync(this.#paths.extensions, newContent.join("\n"));
      return this.#success("Extension removed");
    },
    "list:routes": () => {
      const fileContent = fs.readFileSync(this.#paths.routes, "utf-8");
      if (!fileContent) {
        this.#error("Routes are not cached, please run application once");
        return;
      }
      var data = JSON.parse(fileContent);
      data = JSON.parse(data["bootstrap/routes"]).data;
      const tableData = [];
      data.forEach((d, i) => {
        tableData.push({
          index: i,
          method: d.method,
          path: d.path,
          name: d.name,
        });
      });
      this.#table(
        "Routes",
        [
          { name: "index", color: "blue", title: "Index", alignment: "center" },
          {
            name: "method",
            title: "Method",
            color: "yellow",
            alignment: "left",
          },
          { name: "path", title: "Path", alignment: "left" },
          { name: "name", title: "Name", alignment: "left" },
        ],
        tableData
      );
    },
    "list:validations": () => {
      const fileContent = fs.readFileSync(this.#paths.validations, "utf-8");
      if (!fileContent) {
        this.#error("Validations are not cached, please run application once");
        return;
      }
      var data = JSON.parse(fileContent);
      data = JSON.parse(data["bootstrap/validations"]).data;
      const tableData = [];
      Object.keys(data).forEach((d, i) => {
        tableData.push({
          index: i,
          validation: d,
          params: JSON.stringify(data[d].params),
        });
      });
      this.#table(
        "Validations",
        [
          { name: "index", color: "blue", title: "Index", alignment: "center" },
          {
            name: "validation",
            title: "Validation",
            color: "yellow",
            alignment: "left",
          },
          { name: "params", title: "Params", alignment: "left" },
        ],
        tableData
      );
    },
    "list:middlewares": () => {
      const fileContent = fs.readFileSync(this.#paths.middlewares, "utf-8");
      if (!fileContent) {
        this.#error("Middlewares are not cached, please run application once");
        return;
      }
      var data = JSON.parse(fileContent);
      data = JSON.parse(data["bootstrap/middlewares"]).data;
      const tableData = [];
      Object.keys(data).forEach((d, i) => {
        tableData.push({
          index: i,
          middleware: d,
          params: JSON.stringify(data[d].params),
        });
      });
      this.#table(
        "Middlewares",
        [
          { name: "index", color: "blue", title: "Index", alignment: "center" },
          {
            name: "middleware",
            title: "Middleware",
            color: "yellow",
            alignment: "left",
          },
          { name: "params", title: "Params", alignment: "left" },
        ],
        tableData
      );
    },
    publish: (name) => {
      const folderPath =
        __dirname +
        (name.startsWith("/") ? "" : "/") +
        (name.endsWith("/") ? name : name + "/");
      const publishFile = folderPath + ".publish";
      const { filterKey, filterData } = this.#parseFilter(
        this.#checkArgv({
          argv: "--filter=",
          split: "=",
        })
      );

      const publishData = require("dotenv").config({
        path: publishFile,
      }).parsed;

      if (!filterKey) filterKey = Object.keys(publishData);

      Object.keys(publishData).forEach((key) => {
        if (!Object.keys(this.#paths).includes(key)) return;
        if (filterKey.length && !filterKey.includes(key)) return;
        let value = publishData[key].split(",");
        value.forEach((val) => {
          if (
            Object.keys(filterData).length &&
            filterData[key] &&
            !filterData[key].includes(path.parse(val).name)
          ) {
            return;
          }
          let filePath =
            folderPath + (val.startsWith("/") ? val.slice(1) : val);
          fs.copyFileSync(filePath, this.#paths[key] + path.basename(val));
        });
      });

      this.#success("Package Published");
    },
    help: () => {
      this.#table(
        "Commands",
        [
          { name: "index", color: "blue", title: "Index", alignment: "center" },
          {
            name: "command",
            title: "Command",
            color: "yellow",
            alignment: "left",
          },
          { name: "description", title: "Description", alignment: "left" },
          { name: "usage", title: "Usage", alignment: "left" },
        ],
        [
          {
            index: 1,
            command: "make:controller",
            description: "Make Contoller",
            usage: "make:controller <name>",
          },
          {
            index: 2,
            command: "make:model",
            description: "Make Model",
            usage: "make:model <name>",
          },
          {
            index: 3,
            command: "make:validation",
            description: "Make Validation",
            usage: "make:validation <name>",
          },
          {
            index: 4,
            command: "make:job",
            description: "Make Job",
            usage: "make:job <name>",
          },
          {
            index: 5,
            command: "make:worker",
            description: "Make Worker",
            usage: "make:worker <name>",
          },
          {
            index: 6,
            command: "list:routes",
            description: "List All Routes",
            usage: "list:routes",
          },
          {
            index: 7,
            command: "list:validations",
            description: "List All Validations",
            usage: "list:validations",
          },
          {
            index: 8,
            command: "list:middlewares",
            description: "List All Middlewares",
            usage: "list:middlewares",
          },
          {
            index: 9,
            command: "list:jobs",
            description: "List All Jobs",
            usage: "list:jobs",
          },
          {
            index: 10,
            command: "add",
            description: "Add Extension",
            usage: "add <name>",
          },
          {
            index: 11,
            command: "remove",
            description: "Remove Extension",
            usage: "remove <name>",
          },
        ]
      );
    },
  };
  static #templates = {
    controller: {
      default: `module.exports = {\n\tindex: (req, res) => {\n\t\t\t\n\t},\n};\n`,
    },
    model: {
      default:
        'const mongoose = require("mongoose");\n\nconst :name:Schema = mongoose.Schema(\n  {\n\t\tkey: value,\n  },\n  {\n\t\ttimestamps: true,\n  } \n);\n\nconst :name: = mongoose.model("User", :name:Schema);\n\nmodule.exports = :name:;\n',
    },
    validation: {
      default:
        'module.exports = {\n  testValidation: {\n\tparams: {\n\t  tagId: "required|numeric",\n\t},\n  },\n};\n',
    },
    job: {
      default: `module.exports = class :name: {\n  constructor() {\n\t  super();\n  }\n};\n`,
      mail: `const Mail = require("gefion-mail");\n\nmodule.exports = class :name: extends Mail {\n\tconstructor(to, name) {\n\t\tsuper();\n\t\tthis.template("welcomeMail").send({\n\t\t\tto,\n\t\t\tsubject: "Welcome To My App!",\n\t\t\tdata: { name },\n\t\t});\n\t}\n};\n`,
    },
    worker: {
      default: `const { data, post } = require("gefion-worker");\n\nfunction calculator(data) {\n  return data;\n}\n\t\nconst result = calculator(data);\npost(result);\n`,
    },
  };
  static #paths = {
    config: "./configs/",
    job: "./app/Jobs/",
    model: "./app/Models/",
    worker: "./app/Workers/",
    router: "./routes/",
    middleware: "./app/Http/Middlewares/",
    controller: "./app/Http/Controllers/",
    validation: "./app/Http/Validations/",
    view: "./resources/views/",
    template: "./resource/templates/",
    extensions: "./bootstrap/extensions.js",
    routes: "./storage/cache/bootstrap/routes",
    validations: "./storage/cache/bootstrap/validations",
    middlewares: "./storage/cache/bootstrap/middlewares",
  };
  static #warning(message) {
    console.log(`\x1b[33m${message}\x1b[0m`);
  }

  static #success(message) {
    console.log(`\x1b[32m${message}\x1b[0m`);
  }

  static #error(message) {
    console.log(`\x1b[31m${message}\x1b[0m`);
  }

  static #table(title, columns, rows) {
    const p = new Table({
      title,
      columns,
    });
    p.addRows(rows);
    p.printTable();
  }

  static #checkPackage(name) {
    try {
      require(name);
    } catch (error) {
      return false;
    }
    return true;
  }

  static #parseFilter(filter) {
    let filterData = {};
    let filterKey = [];

    if (filter) {
      const data = filter.split(",");
      const regex = /\[(.*?)\]/g;
      data.forEach((d) => {
        const match = d.match(regex);
        if (match) {
          let key = d.replace(match[0], "");
          filterKey.push(key);
          filterData[key] = match[0]
            .replace("[", "")
            .replace("]", "")
            .split(".");
        } else {
          filterKey.push(d);
        }
      });
    }

    return { filterData, filterKey };
  }

  static #checkArgv({ argv, split, def }) {
    const Arg = this.#argv.find((arg) => arg.startsWith(argv));
    if (Arg) {
      if (split) {
        return Arg.split(split)[1];
      } else {
        return true;
      }
    }
    return def;
  }

  static add(command, callback) {
    this.#commands[command] = callback;
  }

  static init() {
    this.#warning("Welcome to the Gefion!");
    var command = this.#argv[0];

    if (command) {
      if (this.#commands[command]) {
        this.#commands[command](this.#argv[1]);
      }
    } else this.#error("Undefined command!");
    process.exit(0);
  }
};
