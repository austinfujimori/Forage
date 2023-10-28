const mongoose = require("mongoose");

const pastOrderSchema = mongoose.Schema({
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

pastOrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

pastOrderSchema.set("toJSON", {
  virtuals: true,
});

exports.PastOrder = mongoose.model("PastOrder", pastOrderSchema);
