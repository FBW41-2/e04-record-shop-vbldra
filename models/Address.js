const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    }
  }
);

module.exports = AddressSchema;
