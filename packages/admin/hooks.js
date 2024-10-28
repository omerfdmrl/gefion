const Hook = require("@gefion/hook");
const Package = require("./HookViews/Package");
const Setting = require("./HookViews/Setting");
const Config = require("@gefion/config");

Hook.add("admin-navbar-menu", (data) => {
  data.push({
    name: "Settings",
    path: "page",
    type: "relative",
    params: {
      path: "settings",
    },
  });
  data.push({
    name: "Packages",
    path: "page",
    type: "relative",
    params: {
      path: "packages",
    },
  });
  return data;
});

Hook.add("admin-sidebar-menu", (data) => {
  data.push({
    name: "Settings",
    path: "page",
    type: "relative",
    params: {
      path: "settings",
    },
  });
  data.push({
    name: "Packages",
    path: "page",
    type: "relative",
    params: {
      path: "packages",
    },
  });
  return data;
});

Hook.add("admin-page-packages", () => {
  return {
    view: Package,
  };
});

Hook.add("admin-page-settings", () => {
  return {
    view: Setting,
    callback: {
      save: (data) => {
        Object.keys(data).forEach((key) => {
          Config.set(key, data[key]);
        });
      },
    },
  };
});
