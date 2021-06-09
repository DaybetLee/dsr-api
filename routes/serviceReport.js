const express = require("express");
const router = express.Router();
const _ = require("lodash");
const config = require("config");
const fs = require("fs");

const managerBelow = require("../middlewares/authorization/managerBelow");
const { getTimeDiff, getWeekday } = require("../utils/helperFunction");
const { ServiceReport, validate } = require("../models/serviceReport");
const customerEmail = require("../utils/emailTemplates/customerCopy");
const inventoryEmail = require("../utils/emailTemplates/inventory");
const authentication = require("../middlewares/authentication");
const { ProductVendor } = require("../models/productVendor");
const validateID = require("../middlewares/validateID");
const nodemailer = require("../utils/nodemailer");
const htmlToPDF = require("../utils/htmlToPDF");
const { User } = require("../models/user");

router.get("/", [authentication], async (req, res) => {
  let searchQuery = req.query.search;
  const regexQuery = new RegExp(searchQuery, "i");

  if (
    config.get("userPriority")[req.user.role] ==
    config.get("userPriority")["user"]
  ) {
    const serviceReports = await ServiceReport.find({
      $or: [
        { companyName: regexQuery },
        { site: regexQuery },
        { address: regexQuery },
        { contactPerson: regexQuery },
        { contactPersonEmail: regexQuery },
        { telephone: regexQuery },
        { ticketNumber: regexQuery },
        { actionTaken: regexQuery },
        { remark: regexQuery },
        { movementType: regexQuery },
        { movementRemark: regexQuery },
        { jobCategory: regexQuery },
        { swapReason: regexQuery },
        { signedByUser: regexQuery },
        { signedBy: regexQuery },
      ],
    }).and({ owner: req.user._id });

    if (parseInt(searchQuery, 10)) {
      searchQuery = parseInt(searchQuery, 10);
      return await ServiceReport.find({
        reportNumber: searchQuery,
      })
        .and({ owner: req.user._id })
        .then((serviceReport) =>
          res.send(serviceReports.concat(serviceReport))
        );
    } else return await res.send(serviceReports);
  }

  const serviceReports = await ServiceReport.find({
    $or: [
      { companyName: regexQuery },
      { site: regexQuery },
      { address: regexQuery },
      { contactPerson: regexQuery },
      { contactPersonEmail: regexQuery },
      { telephone: regexQuery },
      { ticketNumber: regexQuery },
      { actionTaken: regexQuery },
      { remark: regexQuery },
      { movementType: regexQuery },
      { movementRemark: regexQuery },
      { jobCategory: regexQuery },
      { swapReason: regexQuery },
      { signedByUser: regexQuery },
      { signedBy: regexQuery },
    ],
  });

  if (parseInt(searchQuery, 10)) {
    searchQuery = parseInt(searchQuery, 10);
    return await ServiceReport.find({
      reportNumber: searchQuery,
    }).then((serviceReport) => res.send(serviceReports.concat(serviceReport)));
  } else return await res.send(serviceReports);
});

router.get("/me", [authentication, managerBelow], async (req, res) => {
  ServiceReport.find({ owner: req.user._id })
    .sort("_id")
    .then((serviceReport) => res.send(serviceReport));
});

router.get("/:id", [authentication, validateID], async (req, res) => {
  const serviceReport = await ServiceReport.findById(req.params.id);
  if (!serviceReport) return res.status(404).send("Service Report Not Found");
  res.send(serviceReport);
});

router.post("/", [authentication, managerBelow], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let serviceReport = new ServiceReport({
    companyName: req.body.companyName,
    site: req.body.site,
    address: req.body.address,
    contactPerson: req.body.contactPerson,
    contactPersonEmail: req.body.contactPersonEmail,
    telephone: req.body.telephone,
    productVendor: req.body.productVendor,
    ticketNumber: req.body.ticketNumber,
    actionTaken: req.body.actionTaken,
    remark: req.body.remark,
    chargeable: req.body.chargeable,
    serviceDateTime: req.body.serviceDateTime,
    completedDateTime: req.body.completedDateTime,
    partNumber: req.body.partNumber,
    movementType: req.body.movementType,
    movementRemark: req.body.movementRemark,
    swapReason: req.body.swapReason,
    jobCategory: req.body.jobCategory,
    customerSignature: req.body.customerSignature,
    userSignature: req.body.userSignature,
    signedByUser: req.body.signedByUser,
    signedBy: req.body.signedBy,
    owner: req.body.owner,
  });

  if (!serviceReport.owner) serviceReport.owner = req.user._id;
  serviceReport.activityTimeInMin = getTimeDiff(
    req.body.serviceDateTime,
    req.body.completedDateTime
  );
  serviceReport.weekday = getWeekday(req.body.serviceDateTime);

  serviceReport = await serviceReport
    .save()
    .catch((err) => res.status(400).send(err.message));

  serviceReport.reportNumber = parseInt(
    parseInt(String(serviceReport._id).substring(3, 9), 16)
  );

  const user = await User.findById(serviceReport.owner);
  const manager = await User.findById(user.manager);
  const emailList = [user.email];
  if (manager) emailList.push(manager.email);

  if (serviceReport.swapReason != "N/A") {
    const output = inventoryEmail(serviceReport);
    const mailTo = `${config.get("inventoryAdmin")}`;
    const mailSubject = `[INVENTORY] - ${serviceReport.productVendor} Re: Ticket ${serviceReport.ticketNumber}, [${serviceReport.companyName}]`;
    await nodemailer({
      output,
      mailTo,
      mailSubject,
      cc: emailList,
    });
  }

  const productVendor = await ProductVendor.findById(
    serviceReport.productVendor
  );

  const output = customerEmail(serviceReport, productVendor);
  const mailTo = `${serviceReport.contactPersonEmail}`;
  const mailSubject = `Digital Service Report ${serviceReport.reportNumber} - Ticket ${serviceReport.ticketNumber}`;
  await htmlToPDF(`DSR-${serviceReport.reportNumber}`, output);
  await nodemailer({
    output,
    mailTo,
    mailSubject,
    filename: `DSR-${serviceReport.reportNumber}`,
    cc: emailList,
  }).then(() =>
    fs.unlink(`./tmp/DSR-${serviceReport.reportNumber}.pdf`, (err) => {
      if (err) throw err;
    })
  );

  serviceReport
    .save()
    .then(() => res.send("success"))
    .catch((err) => res.status(400).send(err.message));
});

module.exports = router;
