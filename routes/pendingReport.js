const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { PendingReport, validate } = require("../models/pendingReport");
const managerBelow = require("../middlewares/authorization/managerBelow");
const authentication = require("../middlewares/authentication");
const nodemailer = require("../utils/nodemailer");
const validateID = require("../middlewares/validateID");
const { User } = require("../models/user");
const signingRequestEmail = require("../utils/emailTemplates/signingRequest");

router.post("/", [authentication, managerBelow], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let pendingReport = new PendingReport({
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

  pendingReport.owner = req.user._id;

  // pendingReport.activityTimeInMin = getTimeDiff(
  //   req.body.serviceDateTime,
  //   req.body.completedDateTime
  // );
  // pendingReport.weekday = getWeekday(
  //   req.body.serviceDateTime,
  //   req.body.completedDateTime
  // );

  pendingReport = await pendingReport.save();

  await User.findByIdAndUpdate(req.user.manager, {
    $push: { request: pendingReport._id },
  });

  const manager = await User.findById(req.user.manager);
  const user = await User.findById(req.user._id);

  const output = signingRequestEmail(manager, user);
  const mailTo = `${manager.email}`;
  const mailSubject = `[SIGNING REQUEST] - New request from ${user.name}`;
  await nodemailer({ output, mailTo, mailSubject, cc: [user.email] });

  res.send("success");
});

router.get("/me/:deny", [authentication, managerBelow], async (req, res) => {
  // const schema = Joi.object({
  //   deny: Joi.boolean().required(),
  // });

  // const { error } = schema.validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  PendingReport.find({ owner: req.user._id })
    .and({ deny: req.params.deny })
    .sort("_id")
    .select("-activityTimeInMin -weekday -__v")
    .then((serviceReport) => res.send(serviceReport));
});

router.delete("/:id", [authentication, validateID], async (req, res) => {
  const pendingReport = await PendingReport.findByIdAndRemove(req.params.id);
  if (!pendingReport) return res.status(404).send("Report Not Found");
  res.send("deleted");
});

router.get(
  "/:id",
  [authentication, validateID, managerBelow],
  async (req, res) => {
    const pendingReport = await PendingReport.findById(req.params.id).select(
      "-activityTimeInMin -weekday -__v"
    );

    return pendingReport
      ? res.send(pendingReport)
      : res.status(404).send("Report Not Found");
  }
);

router.get("/", [authentication, managerBelow], async (req, res) => {
  const user = await User.findById(req.user._id);

  PendingReport.find({ _id: { $in: user.request } })
    .sort("_id")
    .select("-activityTimeInMin -weekday -__v")
    .then((serviceReport) => res.send(serviceReport));
});

router.patch("/:id", [authentication, validateID], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // await PendingReport.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $set: _.pick(req.body, ["deny", "denyMessage"]),
  //   },
  //   { new: true }
  // ).then((pendingReport) => res.send(pendingReport));

  let pending = await PendingReport.findById(req.params.id);
  if (!pending) return res.status(404).send("Service Report Not Found");

  await PendingReport.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        deny: req.body.deny,
        denyMessage: req.body.denyMessage || pending.denyMessage,
        companyName: req.body.companyName || pending.companyName,
        site: req.body.site || pending.site,
        address: req.body.address || pending.address,
        contactPerson: req.body.contactPerson || pending.contactPerson,
        contactPersonEmail:
          req.body.contactPersonEmail || pending.contactPersonEmail,
        telephone: req.body.telephone || pending.telephone,
        productVendor: req.body.productVendorId || pending.productVendor,
        ticketNumber: req.body.ticketNumber || pending.ticketNumber,
        actionTaken: req.body.actionTaken || pending.actionTaken,
        remark: req.body.remark || pending.remark,
        chargeable: req.body.chargeable || pending.chargeable,
        serviceDateTime: req.body.serviceDateTime || pending.serviceDateTime,
        completedDateTime:
          req.body.completedDateTime || pending.completedDateTime,
        partNumber: req.body.partNumber || pending.partNumber,
        movementType: req.body.movementType || pending.movementType,
        movementRemark: req.body.movementRemark || pending.movementRemark,
        swapReason: req.body.swapReason || pending.swapReason,
        jobCategory: req.body.jobCategory || pending.jobCategory,
        userSignature: req.body.userSignature || pending.userSignature,
        signedByUser: req.body.signedByUser || pending.signedByUser,
        signedBy: req.body.signedBy || pending.signedBy,
        owner: req.body.owner || pending.owner,
      },
    },
    { new: true }
  );

  if (!req.body.deny)
    await User.findByIdAndUpdate(req.user.manager, {
      $push: { request: req.params.id },
    });

  if (req.body.deny)
    await User.findByIdAndUpdate(req.user.manager, {
      $pull: { request: req.params.id },
    });

  res.send("success");
});

module.exports = router;
