const mongoose = require("mongoose");
const teingisonal = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
    senderEmail: {
    type: String,
    // required: true,
  },
  reciverEmail: {
    type: String,
    // required: true,
  },
  transactionFee: {
    type: Number,
    // required: true,
  },
  trangisionAmount:{
    type: Number
  }
});


module.exports = mongoose.model("Trangision", teingisonal);
