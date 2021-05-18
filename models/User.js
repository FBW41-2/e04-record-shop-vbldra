const mongoose = require("mongoose");
const { Schema } = mongoose;
const Address = require('./Address')

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: Address,   // 1 to 1 connection
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false     // not use by default
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

UserSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
