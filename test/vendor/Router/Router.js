const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

let Router, Server, Config, middleware, validation;

function request() {
  return chai.request(Server.provider().app);
}

before(function () {
  Router = require("@gefion/router");
  Server = require("@gefion/server");
  Config = require("@gefion/config");
  middleware = require("./middleware");
  validation = require("./validation");
  Router.clear();
});

before(function () {
  Router.get("/test/get", function (req, res) {
    res.sendStatus(200);
  });
  Router.post("/test/post", function (req, res) {
    res.sendStatus(200);
  });
  Router.get("/test/getwp/:paramter", function (req, res) {
    res.send(req.params.paramter);
  });
  Router.get("/test/getwm", middleware.callback, function (req, res) {
    res.send(req.params.data);
  });
  Router.validation(validation.validation).get(
    "/test/getwv/:paramter",
    function (req, res) {
      res.send(req.params.parameter);
    }
  );
  Router.get("/test/getwh", middleware.callback, function (req, res) {
    res.sendFile("index.html", { root: __dirname });
  });
});

it("get request", function () {
  request()
    .get("/test/get")
    .end((err, res) => {
      chai.expect(res.status).to.be.eq(200);
    });
});
it("post request", function () {
  request()
    .post("/test/post")
    .end((err, res) => {
      chai.expect(res.status).to.be.eq(200);
    });
});
it("request with parameter", function () {
  let parameter = "foo";
  request()
    .get("/test/getwp/" + parameter)
    .end((err, res) => {
      chai.expect(res.text).to.be.eq(parameter);
    });
});
it("request with middleware", function () {
  request()
    .get("/test/getwm/")
    .end((err, res) => {
      chai.expect(res.text).to.be.eq(middleware.data);
    });
});
it("request with validation", function () {
  request()
    .get("/test/getwv/" + validation.data + "12")
    .end((err, res) => {
      chai.expect(res.status).to.be.eq(500);
    });
});
it("request with html", function () {
  request()
    .get("/test/getwh/")
    .end((err, res) => {
      chai
        .expect(res.text)
        .to.be.eq(
          "<h1>There is some fiction in your truth, and some truth in your fiction.</h1>"
        );
    });
});
