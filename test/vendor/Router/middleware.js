module.exports = {
  data: "bar",
  callback: function (req, res, next) {
    req.params.data = "bar";
    next();
  },
};
