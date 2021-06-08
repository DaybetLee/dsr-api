const mongoose = require("mongoose");
const winston = require("../utils/winston");
const config = require("config");

const db = config.get("db");

module.exports = mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => winston.info(`Connected to ${db}...`));
