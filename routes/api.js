const Router = require("@gefion/router");

Router.prefix("dash")
  .name("pref-")
  .validation("test.")
  .controller("test.")
  .group(() => {
    Router.get("/home", "testController").name("home");

    Router.get("/home2", "testController2").name("home2");

    Router.validation("testValidation")
      .get("/home3/:tagId", "testController")
      .name("home3");
  });
