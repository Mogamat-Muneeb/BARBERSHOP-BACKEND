const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: false,
    },
    style: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", sessionSchema);
