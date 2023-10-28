const { Order } = require("../models/order");
const express = require("express");
const router = require("express").Router();
const mongoose = require("mongoose");
const { Party } = require("../models/party");
const multer = require("multer");

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user")
    .populate({
      path: "party",
      populate: { path: 'host' }
    })
    .sort({ dateOrdered: -1 });
  //sort newest to oldest => -1

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user")
    .populate({
      path: "party",
      populate: { path: 'host' }
    })
    .sort({ dateOrdered: -1 });
    // .populate({
    //   path: "orderItems",
    //   populate: { path: "party", populate: "category" },
    // });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  let order = new Order({
    party: req.body.party,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  _order = await order.save();

  if (!_order) return res.status(404).send("the order cannot be created");

  res.send(_order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(404).send("the order cannot be created");

  res.send(order);
});


router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        // await order.orderItems.map(async (orderItem) => {
        //   await OrderItem.findByIdAndRemove(orderItem);
        // });

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

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalsales: { $sum: "$totalPrice" },
      },
    },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count).clone();

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    ordercount: orderCount,
  });
});

// get the orders given a user ID
router.get(`/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })

  
  .populate({
    path: "party",
    populate: { path: 'host' }
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
  const partyOrderList = await Order.find({ party: req.params.partyid })
  .populate({
    path: "party",
    populate: { path: 'host' }
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
  const partyOrderList = await Order.find({ party: req.params.partyid })

    Order.deleteMany({ party: req.params.partyid })
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


//change status to USER CONFIRMED
router.put("/userConfirm/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "user confirmed",
    },
    { new: true }
  );
  console.log(order)

  if (!order) return res.status(404).send("user cannot confirm");

  res.send(order);
});

//change status to HOST CONFIRMED
router.put("/hostConfirm/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "host confirmed",
    },
    { new: true }
  );
  console.log(order)

  if (!order) return res.status(404).send("host cannot confirm");

  res.send(order);
});

//change status back to pending
router.put("/pending/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "Pending",
    },
    { new: true }
  );
  console.log(order)

  if (!order) return res.status(404).send("host cannot confirm");

  res.send(order);
});

module.exports = router;