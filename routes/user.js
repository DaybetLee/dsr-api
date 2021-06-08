const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jpc = require("joi-password-complexity");

const { User, validate } = require("../models/user");
const authentication = require("../middlewares/authentication");
const adminOnly = require("../middlewares/authorization/adminOnly");
const validateID = require("../middlewares/validateID");
const nodemailer = require("../utils/nodemailer");
const newUserEmail = require("../utils/emailTemplates/newUser");

router.post("/", [authentication, adminOnly], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already in used");

  if (req.body.managerId) {
    user = await User.findById({ _id: req.body.managerId });
    if (!user) return res.status(400).send("ManagerId not found");
  }

  user = new User(
    _.pick(req.body, [
      "email",
      "password",
      "name",
      "businessUnit",
      "staffNumber",
      "role",
      "request",
    ])
  );
  user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
  if (req.body.managerId) user.manager = req.body.managerId;

  await user.save();

  const output = newUserEmail(user, req.body.password);
  const mailTo = `${user.email}`;
  const mailSubject = `[Digital Service Report] - ${user.name} account creation.`;
  await nodemailer({ output, mailTo, mailSubject });

  res.send("success");
});

router.put(
  "/:id",
  [authentication, validateID, adminOnly],
  async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.find({ email: req.body.email });
    let current = await User.findById(req.params.id);

    if (
      user &&
      user.length < 2 &&
      current._id.toString() != user[0]._id.toString()
    )
      return res.status(400).send(`${req.body.email} Has Been Taken`);

    const password = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );

    user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name || current.name,
          businessUnit: req.body.businessUnit || current.businessUnit,
          staffNumber: req.body.staffNumber || current.staffNumber,
          email: req.body.email || current.email,
          manager: req.body.managerId || current.managerId,
          role: req.body.role || current.role,
          userSignature: req.body.userSignature || current.userSignature,
          request: req.body.request || current.request,
          password: password,
        },
      },
      { new: true }
    );
    return user ? res.send("success") : res.status(404).send("User Not Found");
  }
);

router.patch("/:id/:prop", [authentication, validateID], async (req, res) => {
  const option = {
    min: 10,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  };

  const schema =
    req.params.prop == "email"
      ? Joi.object({
          email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        })
      : req.params.prop == "name"
      ? Joi.object({
          name: Joi.string()
            .pattern(/[\d\w\s]/)
            .min(3)
            .max(255)
            .required(),
        })
      : req.params.prop == "businessUnit"
      ? Joi.object({
          businessUnit: Joi.objectId().required().label("Business Unit"),
        })
      : req.params.prop == "staffNumber"
      ? Joi.object({
          staffNumber: Joi.string().min(3).max(30).required(),
        })
      : req.params.prop == "manager"
      ? Joi.object({ managerId: Joi.objectId().required() })
      : req.params.prop == "password"
      ? Joi.object({
          password: jpc(option).required(),
          rep_pass: Joi.any()
            .equal(Joi.ref("password"))
            .required()
            .label("Password")
            .messages({ "any.only": "{{#label}} does not match" }),
        }).with("password", "rep_pass")
      : req.params.prop == "role"
      ? Joi.object({ role: Joi.string().valid("user", "manager", "admin") })
      : req.params.prop == "userSignature"
      ? Joi.object({ userSignature: Joi.string() })
      : req.params.prop == "request"
      ? Joi.object({ requestId: Joi.objectId() })
      : null;

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.params.prop == "manager") {
    const manager = await User.findById(req.body.managerId);
    if (!manager) return res.status(400).send("ManagerId Not Found");
  }

  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User Not Found");

  if (req.params.prop == "password") {
    const password = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
    user = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: password,
        },
      }
    );
  } else
    user = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          manager: req.body.managerId || user.manager,
          name: req.body.name || user.name,
          businessUnit: req.body.businessUnit || user.businessUnit,
          staffNumber: req.body.staffNumber || user.staffNumber,
          email: req.body.email || user.email,
          role: req.body.role || user.role,
          userSignature: req.body.userSignature || user.userSignature,
        },
        $pull: { request: req.body.requestId },
      }
    );
  return res.send(user);
});

router.delete(
  "/:id",
  [authentication, validateID, adminOnly],
  async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User Not Found");

    if (user.role == "superadmin")
      return res.status(403).send("Action Not Allowed");

    user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send("User Not Found");

    await User.updateMany(
      { manager: req.params.id },
      { $unset: { manager: "" } }
    );

    res.send("success");
  }
);

router.get("/me", [authentication], async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

router.get("/manager", [authentication, adminOnly], async (req, res) => {
  await User.find({ role: "manager" })
    .select("_id name")
    .sort("name")
    .then((user) => res.send(user));
});

router.get("/:id", [authentication, validateID], async (req, res) => {
  const user = await User.findById(req.params.id);
  return user ? res.send(user) : res.status(404).send("User Not Found");
});

router.get("/", [authentication], async (req, res) => {
  await User.find()
    .select("-password -__v")
    .sort("name")
    .then((user) => res.send(user));
});

module.exports = router;
