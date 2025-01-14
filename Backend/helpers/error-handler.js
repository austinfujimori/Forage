function errorHandler(err, req, res, next) {
  //jwt auth error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  //validatin error
  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  //deafutl to server error, (500)
  return res.status(500).json(err);
}

module.exports = errorHandler;