const Config = require("@gefion/config");
const Hook = require("@gefion/hook");
const Permission = require("./HookViews/Permission");

Hook.add("admin-navbar-menu", (data) => {
  data.push({
    name: "Permission",
    path: "page",
    type: "relative",
    params: {
      path: "permission",
    },
    parent: "settings",
  });
  return data;
});

Hook.add("admin-sidebar-menu", (data) => {
  data.push({
    name: "Permission",
    path: "page",
    type: "relative",
    params: {
      path: "permission",
    },
    parent: "settings",
  });
  return data;
});

Hook.add("admin-page-permission", () => {
  return {
    callback: {
      save: (data) => {
        Config.set("permission", data);
      },
      add: (data) => {
        const currentData = Config.get("permission");
        currentData[data.name] = data.permissions;
        Config.set("permission", currentData);
      },
      delete: (data) => {
        const currentData = Config.get("permission");
        delete currentData[data];
        Config.set("permission", currentData);
      },
      default: (data) => {
        const currentData = Config.get("permission");
        currentData["default"] = data;
        Config.set("permission", currentData);
      },
    },
    view: Permission,
  };
});
