const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { serviceReportSchema } = require("./serviceReport");

serviceReportSchema.add({
  deny: { type: Boolean, default: false },
  denyMessage: { type: String, maxlength: 255, default: "" },
});

const pendingReportSchema = new mongoose.Schema(serviceReportSchema);

const PendingReport = mongoose.model("pendingReport", pendingReportSchema);

const validate = (body) => {
  const partNumber = Joi.array().items(
    Joi.object({
      partNo: Joi.string().max(255),
      from: Joi.string().max(255),
      to: Joi.string().max(255),
    })
  );
  const movementType = Joi.string().valid(
    "Direct RMA",
    "Maintenance Swap",
    "3-Legged RMA"
  );
  const movementRemark = Joi.string().valid(
    "Temporary Loan",
    "Permanent Replacement"
  );
  const schema = Joi.object({
    companyName: Joi.string().max(255).label("Company Name"),
    site: Joi.string().allow(null, "").max(255).label("Site"),
    address: Joi.string().allow(null, "").max(255).label("Address"),
    contactPerson: Joi.string().max(255).label("Contact Person"),
    contactPersonEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .label("Contact Person Email"),
    telephone: Joi.string()
      .allow(null, "")
      .pattern(/\d/)
      .max(8)
      .min(8)
      .label("Telephone"),
    productVendor: Joi.objectId().label("Product Vendor"),
    ticketNumber: Joi.string()
      .pattern(/\d/)
      .max(8)
      .min(8)
      .allow(null, "")
      .label("ticket Number"),
    actionTaken: Joi.string().max(2500).allow(null, "").label("Action Taken"),
    remark: Joi.string().allow(null, "").max(255).label("Remark"),
    chargeable: Joi.boolean(),
    serviceDateTime: Joi.date(),
    completedDateTime: Joi.date(),
    partNumber: joiCondition(partNumber),
    movementType: joiCondition(movementType),
    movementRemark: joiCondition(movementRemark),
    jobCategory: Joi.string().valid("Post-Sale", "Project", "Pre-Sale"),
    swapReason: Joi.string().valid("N/A", "Replacement", "Repair", "Loan"),

    customerSignature: Joi.string().allow(null, "").label("Signature"),
    userSignature: Joi.string(),
    reportNumber: Joi.any().label("Report Number"),
    signedByUser: Joi.string().max(255),
    signedBy: Joi.string().max(255).allow(null, ""),
    owner: Joi.objectId().allow(null, ""),
    deny: Joi.boolean().allow(null, ""),
    denyMessage: Joi.string().max(255).allow(null, ""),
  });
  return schema.validate(body);
};

function joiCondition(option) {
  return Joi.when("swapReason", {
    not: "N/A",
    then: option,
  });
}

exports.PendingReport = PendingReport;
exports.validate = validate;
