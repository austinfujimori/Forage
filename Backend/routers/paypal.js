const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

// Define the Payouts Endpoint
router.post('/payout', paypalController.handlePayout);
router.post('/create-payment', paypalController.createPayment);
router.post('/capture-payment', paypalController.capturePayment);

module.exports = router;