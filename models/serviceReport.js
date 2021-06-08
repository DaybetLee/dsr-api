const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const serviceReportSchema = new mongoose.Schema({
  companyName: { type: String, maxlength: 255 },
  site: { type: String, maxlength: 255 },
  address: { type: String, maxlength: 255 },
  contactPerson: { type: String, maxlength: 255 },
  contactPersonEmail: {
    type: String,
    maxlength: 255,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  telephone: {
    type: String,
    match: /\d/,
  },
  productVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productVendor",
  },
  ticketNumber: {
    type: String,
    match: /\d/,
  },
  actionTaken: { type: String, maxlength: 2500 },
  remark: { type: String, maxlength: 255 },
  chargeable: { type: Boolean },
  serviceDateTime: { type: Date },
  completedDateTime: { type: Date },
  activityTimeInMin: { type: Number },
  weekday: { type: Boolean },
  movementType: {
    type: String,
    enum: ["Direct RMA", "Maintenance Swap", "3-Legged RMA", ""],
  },
  movementRemark: {
    type: String,
    enum: ["Temporary Loan", "Permanent Replacement", ""],
  },
  jobCategory: {
    type: String,
    enum: ["Post-Sale", "Project", "Pre-Sale", ""],
  },
  swapReason: {
    type: String,
    enum: ["N/A", "Replacement", "Repair", "Loan", ""],
  },
  partNumber: {
    type: [
      {
        partNo: { type: String, maxlength: 255 },
        from: { type: String, maxlength: 255 },
        to: { type: String, maxlength: 255 },
        _id: false,
      },
    ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner",
  },
  reportNumber: {
    type: Number,
    unique: true,
    sparse: true,
  },
  customerSignature: {
    type: String,
  },
  userSignature: {
    type: String,
  },
  signedByUser: {
    type: String,
    maxlength: 255,
  },
  signedBy: {
    type: String,
    maxlength: 255,
  },
});

const ServiceReport = mongoose.model("serviceReport", serviceReportSchema);

const validate = (body) => {
  const partNumber = Joi.array()
    .items(
      Joi.object({
        partNo: Joi.string().max(255).required(),
        from: Joi.string().max(255).required(),
        to: Joi.string().max(255).required(),
      })
    )
    .required();

  const movementType = Joi.string()
    .valid("Direct RMA", "Maintenance Swap", "3-Legged RMA")
    .required();
  const movementRemark = Joi.string()
    .valid("Temporary Loan", "Permanent Replacement")
    .required();
  const schema = Joi.object({
    companyName: Joi.string().max(255).required().label("Company Name"),
    site: Joi.string().allow(null, "").max(255).label("Site"),
    address: Joi.string().allow(null, "").max(255).required().label("Address"),
    contactPerson: Joi.string().max(255).required().label("Contact Person"),
    contactPersonEmail: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label("Contact Person Email"),
    telephone: Joi.string()
      .pattern(/\d/)
      .max(8)
      .min(8)
      .allow(null, "")
      .required()
      .label("Telephone"),
    productVendorId: Joi.objectId().required().label("Product Vendor"),
    ticketNumber: Joi.string()
      .pattern(/\d/)
      .max(8)
      .min(8)
      .required()
      .label("ticket Number"),
    actionTaken: Joi.string().max(2500).required().label("Action Taken"),
    remark: Joi.string().allow(null, "").max(255).label("Remark"),
    chargeable: Joi.boolean(),
    serviceDateTime: Joi.date(),
    completedDateTime: Joi.date(),
    partNumber: joiCondition(partNumber),
    movementType: joiCondition(movementType),
    movementRemark: joiCondition(movementRemark),
    jobCategory: Joi.string()
      .valid("Post-Sale", "Project", "Pre-Sale")
      .required(),
    swapReason: Joi.string()
      .valid("N/A", "Replacement", "Repair", "Loan")
      .required(),
    customerSignature: Joi.string().label("Signature"),
    userSignature: Joi.string(),
    reportNumber: Joi.any(),
    signedByUser: Joi.string().max(255),
    signedBy: Joi.string().max(255).allow(null, ""),
    owner: Joi.objectId().allow(null, ""),
  });
  return schema.validate(body);
};

function joiCondition(option) {
  return Joi.when("swapReason", {
    not: "N/A",
    then: option,
  });
}

exports.ServiceReport = ServiceReport;
exports.validate = validate;
exports.serviceReportSchema = serviceReportSchema;
