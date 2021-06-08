const mongoose = require("mongoose");
const Joi = require("joi");

const businessUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 255,
    trim: true,
    set: (v) => v.toUpperCase(),
  },
  description: {
    type: String,
    maxlength: 255,
    trim: true,
  },
});

const BusinessUnit = mongoose.model("businessUnit", businessUnitSchema);

const validate = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required().label("Business Unit"),
    description: Joi.string().max(255).allow(null, "").label("Description"),
  });
  return schema.validate(body);
};

exports.validate = validate;
exports.BusinessUnit = BusinessUnit;
