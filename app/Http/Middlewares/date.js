module.exports = (req, res, next) => {
  console.log("Time:", Date.now());
  next();
};
