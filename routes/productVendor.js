const express = require("express");
const router = express.Router();

const { ProductVendor, validate } = require("../models/productVendor");
const authentication = require("../middlewares/authentication");
const validateID = require("../middlewares/validateID");

router.get("/", [authentication], async (req, res) => {
  ProductVendor.find()
    .sort("_id")
    .select("-__v")
    .then((productVendor) => res.send(productVendor));
});

router.get("/:id", [authentication, validateID], async (req, res) => {
  const productVendor = await ProductVendor.findById(req.params.id);
  return productVendor
    ? res.send(productVendor).select("-__v")
    : res.status(404).send("Report Not Found");
});

router.post("/", [authentication], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productVendor = new ProductVendor({
    name: req.body.name,
  });

  productVendor
    .save()
    .then(() => res.send("success"))
    .catch((err) => res.status(400).send(err.message));
});

router.put("/:id", [authentication, validateID], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const productVendor = await ProductVendor.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );

  return productVendor
    ? res.send("success")
    : res.status(404).send("Template Not Found");
});

router.delete("/:id", [authentication, validateID], async (req, res) => {
  const productVendor = await ProductVendor.findByIdAndDelete(req.params.id);
  return productVendor
    ? res.send("success")
    : res.status(404).send("Report Not Found");
});

module.exports = router;
