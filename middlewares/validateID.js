const mongoose = require("mongoose");

module.exports = (req, res, next) =>
  mongoose.Types.ObjectId.isValid(req.params.id)
    ? next()
    : res.status(404).send("Invalid ID");
