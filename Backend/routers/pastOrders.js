const { PastOrder } = require("../models/pastOrder");
const express = require("express");
const router = require("express").Router();
const mongoose = require("mongoose");
const { Party } = require("../models/party");
const multer = require("multer");

router.get(`/`, async (req, res) => {
  const orderList = await PastOrder.find()
    .populate("user")
    .populate({
      path: "party",
      populate: { path: "host" },
    })
    .sort({ dateOrdered: -1 });
  //sort newest to oldest => -1

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await PastOrder.findById(req.params.id)
    .populate("user")
    .populate({
      path: "party",
      populate: { path: "host" },
    })
    .sort({ dateOrdered: -1 });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  let order = new PastOrder({
    party: req.body.party,
    completedAt: req.body.completedAt,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  _order = await order.save();

  if (!_order) return res.status(404).send("the order cannot be created");

  res.send(_order);
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await PastOrder.countDocuments((count) => count).clone();

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    ordercount: orderCount,
  });
});

// get the orders given a user ID
router.get(`/userorders/:userid`, async (req, res) => {
  const userOrderList = await PastOrder.find({ user: req.params.userid })

    .populate({
      path: "party",
      populate: { path: "host" },
    })
    .populate("user")
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

// get the orders given a party
router.get(`/partyOrders/:partyid`, async (req, res) => {
  const partyOrderList = await PastOrder.find({ party: req.params.partyid })
    .populate({
      path: "party",
      populate: { path: "host" },
    })
    .populate("user")
    .sort({ dateOrdered: -1 });

  if (!partyOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(partyOrderList);
});

//delete the orders given a party
router.delete("/party/:partyid", async (req, res) => {
  const partyOrderList = await PastOrder.find({ party: req.params.partyid });

  PastOrder.deleteMany({ party: req.params.partyid })
    .then(async (order) => {
      if (order) {
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
