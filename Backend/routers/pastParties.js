const { PastParty } = require("../models/pastParty");
const express = require("express");
// const { Category } = require("../models/category");
const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");

router.get(`/`, async (req, res) => {
  const partyList = await PastParty.find().populate("host");

  if (!partyList) {
    res.status(500).json({ success: false });
  }
  res.send(partyList);
});

router.get(`/:id`, async (req, res) => {
  const party = await PastParty.findById(req.params.id).populate("host");

  if (!party) {
    res.status(500).json({ success: false });
  }
  res.send(party);
});

router.post("/", async (req, res) => {
  let party = new PastParty({
    _id: req.body._id,
    host: req.body.host,
    image: req.body.image,
    description: req.body.description,
    address: req.body.address,
    price: req.body.price,
    capacity: req.body.capacity,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
    dateOf: req.body.dateOf,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    membersAttended: req.body.membersAttended,
  });

  _party = await party.save();

  if (!_party) return res.status(404).send("the order cannot be created");

  res.send(_party);
});

router.delete("/:id", (req, res) => {
  PastParty.findByIdAndRemove(req.params.id)
    .then((party) => {
      if (party) {
        return res
          .status(200)
          .json({ success: true, message: "the party is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "party not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//gets total number of parties
router.get(`/get/count`, async (req, res) => {
  const partyCount = await PastParty.countDocuments((count) => count).clone();

  if (!partyCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    pcount: partyCount,
  });
});

// get the party given party host
router.get(`/party/:userid`, async (req, res) => {
  const userParty = await PastParty.find({ host: req.params.userid }).populate(
    "host"
  );

  if (!userParty) {
    res.status(500).json({ success: false });
  }
  res.send(userParty);
});

module.exports = router;
