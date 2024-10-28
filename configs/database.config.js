module.exports = {
  provider: "mongoose1",

  mongoose1: {
    provider: "mongoose",
    url: "mongodb://localhost:27017",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
