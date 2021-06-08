const mongoose = require("mongoose");
const Joi = require("joi");

const productVendorSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 255,
    trim: true,
    set: (v) =>
      v
        .split(" ")
        .map((v) => v[0].toUpperCase() + v.substring(1).toLowerCase())
        .join(" "),
  },
});

const ProductVendor = mongoose.model("productVendor", productVendorSchema);

const validate = (body) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required().label("Product name"),
  });
  return schema.validate(body);
};

exports.validate = validate;
exports.ProductVendor = ProductVendor;
