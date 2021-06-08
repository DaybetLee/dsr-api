const express = require("express");
const router = express.Router();
const _ = require("lodash");

const managerBelow = require("../middlewares/authorization/managerBelow");
const { getTimeDiff, getWeekday } = require("../utils/helperFunction");
const adminOnly = require("../middlewares/authorization/adminOnly");
const authentication = require("../middlewares/authentication");
const { Template, validate } = require("../models/template");
const validateID = require("../middlewares/validateID");

router.get("/me", [authentication, managerBelow], async (req, res) => {
  Template.find({ owner: req.user._id })
    .sort("_id")
    .then((templates) => res.send(templates));
});

router.post("/", [authentication, managerBelow], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let template = new Template({
    companyName: req.body.companyName,
    site: req.body.site,
    address: req.body.address,
    contactPerson: req.body.contactPerson,
    contactPersonEmail: req.body.contactPersonEmail,
    telephone: req.body.telephone,
    productVendor: req.body.productVendorId,
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
    userSignature: req.body.userSignature,
    signedByUser: req.body.signedByUser,
    signedBy: req.body.signedBy,
  });

  template.owner = req.user._id;
  template.activityTimeInMin = getTimeDiff(
    req.body.serviceDateTime,
    req.body.completedDateTime
  );

  template.weekday = getWeekday(
    req.body.serviceDateTime,
    req.body.completedDateTime
  );

  await template
    .save()
    .then(() => res.send("success"))
    .catch((err) => res.status(400).send(err.message));
});

router.put(
  "/:id",
  [authentication, validateID, managerBelow],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let template = Template.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          companyName: req.body.companyName,
          site: req.body.site,
          address: req.body.address,
          contactPerson: req.body.contactPerson,
          contactPersonEmail: req.body.contactPersonEmail,
          telephone: req.body.telephone,
          productVendor: req.body.productVendorId,
          ticketNumber: req.body.ticketNumber,
          actionTaken: req.body.actionTaken,
          remark: req.body.remark,
          chargeable: req.body.chargeable,
          serviceDateTime: req.body.serviceDateTime,
          completedDateTime: req.body.completedDateTime,
          activityTimeInMin: req.body.activityTimeInMin,
          weekday: req.body.weekday,
          partNumber: req.body.partNumber,
          movementType: req.body.movementType,
          movementRemark: req.body.movementRemark,
          owner: req.body.owner,
          swapReason: req.body.swapReason,
          jobCategory: req.body.jobCategory,
          userSignature: req.body.userSignature,
          signedByUser: req.body.signedByUser,
          signedBy: req.body.signedBy,
        },
      },
      { new: true }
    );

    return template
      ? res.send("success")
      : res.status(404).send("Template Not Found");
  }
);

router.get("/", [authentication, managerBelow], async (req, res) => {
  Template.find({ owner: req.user._id })
    .sort("_id")
    .then((serviceReport) => res.send(serviceReport));
});

router.get(
  "/:id",
  [authentication, validateID, managerBelow],
  async (req, res) => {
    const template = await Template.findById(req.params.id).sort("_id");

    if (template.owner != req.user._id)
      return res.status(401).send("Access denied");

    return template
      ? res.send(template)
      : res.status(404).send("Template Not Found");
  }
);

router.delete("/", [authentication], async (req, res) => {
  let template;

  if (req.query.user) {
    template = await Template.deleteMany({ owner: req.query.user });
  } else {
    template = await Template.findByIdAndRemove(req.query.id);
  }
  if (!template) return res.status(404).send("Template Not Found");
  res.send("success");
});

module.exports = router;
