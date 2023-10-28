const mongoose = require("mongoose");

const pastPartySchema = mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  image:{
    type: String
  },
  images:[{
    type: String,
    default: ""
  }],
  description: {
    type: String,
    default: "No description"
  },
  address: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateOf: {
    type: Date,
  },
  longitude: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
  },
  latitude: {
    type: Number,
    default: 0
  },
  membersAttended: {
  type: Number,
  }
});

pastPartySchema.virtual("id").get(function () {
  return this._id.toHexString()
})

pastPartySchema.set("toJSON", {
  virtuals: true
})

exports.PastParty = mongoose.mongoose.model("PastParty", pastPartySchema);