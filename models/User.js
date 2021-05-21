const mongoose = require("mongoose");
const { Schema } = mongoose;
const Address = require("./Address");
const bcrypt = require('bcrypt')


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
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    address: Address,
    role: {
        type: String,
        enum: ["Admin", "User"],
        required: true
    },
    token: String
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

UserSchema.pre('findOneAndUpdate', async function(next) {
    if(this._update.password) {
        this.password = await bcrypt.hash(this.password || this._update.password, 10)
    }
    next()
})

UserSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
