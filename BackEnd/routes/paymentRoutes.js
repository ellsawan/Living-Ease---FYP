const express = require('express');
const { createStripeAccount ,createPaymentIntent} = require('../controllers/paymentController');

const router = express.Router();

// POST route to create payment intent
router.post('/create-payment-intent', createPaymentIntent);
// Route to create Stripe account for landlord
router.post('/create-stripe-account', createStripeAccount);
//save payment method
router.post('/save-payment-method', createPaymentIntent);
module.exports = router;
