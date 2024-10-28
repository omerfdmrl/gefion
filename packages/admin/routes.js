const Router = require("@gefion/router");

Router.get("/get-admin-data", "getAdminData");

Router.post("/get-page", "getPage");

Router.post("/do-page-action", "doPageAction");

Router.post("/data/:model", "createData").get("/data/:model", "listData");

Router.prefix("/data/:model")
  .get(":id", "getData")
  .patch(":id", "setData")
  .delete(":id", "deleteData");
