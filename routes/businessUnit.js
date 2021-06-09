const express = require("express");
const router = express.Router();

const { BusinessUnit, validate } = require("../models/businessUnit");
const validateID = require("../middlewares/validateID");
const authentication = require("../middlewares/authentication");
const { User } = require("../models/user");

router.get("/:id", [authentication, validateID], async (req, res) => {
  const businessUnit = await BusinessUnit.findById(req.params.id);
  return businessUnit
    ? res.send(businessUnit).select("-__v")
    : res.status(404).send("Business Unit Not Found");
});

router.get("/", [authentication], async (req, res) => {
  BusinessUnit.find()
    .sort("_id")
    .select("-__v")
    .then((businessUnit) => res.send(businessUnit));
});

router.post("/", [authentication], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const businessUnit = new BusinessUnit({
    name: req.body.name,
    description: req.body.description,
  });

  businessUnit
    .save()
    .then((result) => res.send(result))
    .catch((err) => res.status(400).send(err.message));
});

router.put("/:id", [authentication, validateID], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const businessUnit = await BusinessUnit.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: req.body.name, description: req.body.description },
    },
    { new: true }
  ).select("-__v");

  return businessUnit
    ? res.send("success")
    : res.status(404).send("Business Unit Not Found");
});

router.delete("/:id", [authentication, validateID], async (req, res) => {
  const user = await User.findOne({
    businessUnit: req.params.id,
  });

  console.log(req.params.id);
  if (user) return res.status(403).send("Business Unit is in use");

  const businessUnit = await BusinessUnit.findByIdAndDelete(req.params.id);

  return businessUnit
    ? res.send("success")
    : res.status(404).send("Business Unit Not Found");
});

module.exports = router;
