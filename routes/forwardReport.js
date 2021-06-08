const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs");

const { ServiceReport } = require("../models/serviceReport");

const managerBelow = require("../middlewares/authorization/managerBelow");
const customerEmail = require("../utils/emailTemplates/customerCopy");
const authentication = require("../middlewares/authentication");
const { ProductVendor } = require("../models/productVendor");
const validateID = require("../middlewares/validateID");
const nodemailer = require("../utils/nodemailer");
const htmlToPDF = require("../utils/htmlToPDF");
const { User } = require("../models/user");

router.post(
  "/:id",
  [authentication, validateID, managerBelow],
  async (req, res) => {
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const serviceReport = await ServiceReport.findById(req.params.id);
    if (!serviceReport) return res.status(404).send("Service Report Not Found");

    if (serviceReport.owner != req.user._id)
      return res.status(401).send("Access denied");

    const user = await User.findById(req.user._id);

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
      cc: [user.email],
      filename: `DSR-${serviceReport.reportNumber}`,
    }).then(() =>
      fs.unlink(`./tmp/DSR-${serviceReport.reportNumber}.pdf`, (err) => {
        if (err) throw err;
      })
    );

    res.send("sent");
  }
);

module.exports = router;
