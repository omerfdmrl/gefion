const Router = require("@gefion/router");

Router.validation("login").post("/login", "login");

Router.validation("logout").post("/logout", "logout");

Router.validation("register").post("/register", "register");

Router.validation("forgot").post("/forgot", "forgot");

Router.validation("refresh").post("/refresh", "refresh");

Router.validation("reset").post("/reset", "reset");

Router.middleware("auth").post("/send-verification", "sendVerification");

Router.validation("verify").post("/verify", "verify");
