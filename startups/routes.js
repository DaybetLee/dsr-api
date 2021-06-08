const express = require("express");

const proxy = require("../middlewares/proxy");
const error = require("../middlewares/error");

const serviceReport = require("../routes/serviceReport");
const user = require("../routes/user");
const template = require("../routes/template");
const userAuth = require("../routes/userAuth");
const forwardReport = require("../routes/forwardReport");
const pendingReport = require("../routes/pendingReport");
const productVendor = require("../routes/productVendor");
const businessUnit = require("../routes/businessUnit");

module.exports = (app) => {
  app.use(proxy);
  app.use(express.json());
  app.use("/api/report", serviceReport);
  app.use("/api/user", user);
  app.use("/api/template", template);
  app.use("/api/productvendor", productVendor);
  app.use("/api/businessunit", businessUnit);
  app.use("/api/forward", forwardReport);
  app.use("/api/pending", pendingReport);
  app.use("/api/login", userAuth);
  app.use(error);
};
