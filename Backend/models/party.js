const mongoose = require("mongoose");

const partySchema = mongoose.Schema({
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
  //categoory schema
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  capacity: {
    type: Number,
    required: true,
    min: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateOf: {
    type: Date,
  },
  memberCount: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  latitude: {
    type: Number,
    default: 0
  },
});

partySchema.virtual("id").get(function () {
  return this._id.toHexString()
})

partySchema.set("toJSON", {
  virtuals: true
})

exports.Party = mongoose.mongoose.model("Party", partySchema);