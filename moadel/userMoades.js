const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  pin: {
    type: Number,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  mobileNumber: {
    type: Number,
    // required: true,
  },
  role: {
    type: String,
    // required: true,
  },
  nid: {
    type: Number,
    // required: true,
  },
  balance: {
    type: Number,
    // required: true,
  },
  userStatus: {
    type: String,
  }
});


module.exports = mongoose.model("User", userSchema);
