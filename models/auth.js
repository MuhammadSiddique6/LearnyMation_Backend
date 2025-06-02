const timeStamp = require("console");
const mongoose = require("mongoose");

const AuthScheme = new mongoose.Schema(
  {
    role: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Auth", AuthScheme);
