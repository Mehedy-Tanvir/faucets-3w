const { model, Schema } = require("mongoose");

const RequestSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  sendingTime: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Request = model("Request", RequestSchema);

module.exports = Request;
