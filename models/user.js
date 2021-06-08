const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jpc = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true,
    match: /^[\d\w\s]{3,255}$/,
    set: (v) =>
      v
        .split(" ")
        .map((v) => v[0].toUpperCase() + v.substring(1).toLowerCase())
        .join(" "),
  },
  businessUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "businessUnit",
  },
  staffNumber: {
    type: String,
    minlength: 3,
    maxlength: 30,
    trim: true,
    required: true,

    set: (v) => v.toUpperCase(),
  },
  email: {
    type: String,
    unique: true,
    maxlength: 255,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
  role: {
    type: String,
    enum: ["user", "admin", "manager", "superadmin"],
    default: "user",
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  userSignature: {
    type: String,
  },
  request: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pendingReport",
      },
    ],
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      manager: this.manager,
    },
    config.get("secretKey"),
    { expiresIn: 60 * 10 }
  );
};

const User = mongoose.model("user", userSchema);

const validate = (body) => {
  const option = {
    min: 10,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  };

  const schema = Joi.object({
    name: Joi.string()
      .pattern(/[\d\w\s]/)
      .min(3)
      .max(255)
      .required()
      .label("Name"),
    businessUnit: Joi.objectId().required().label("Business Unit"),
    staffNumber: Joi.string().min(3).max(30).required().label("Staff Number"),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label("Email"),
    role: Joi.string().valid("user", "manager", "admin").label("Role"),
    managerId: Joi.objectId().label("Manager").allow(null, ""),
    password: jpc(option).required().label("Password"),
    rep_pass: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Password")
      .messages({ "any.only": "{{#label}} does not match" }),
    userSignature: Joi.string().allow(null, ""),
    request: Joi.array().items(Joi.objectId()).allow(null),
  }).with("password", "rep_pass");
  return schema.validate(body);
};

exports.User = User;
exports.validate = validate;
