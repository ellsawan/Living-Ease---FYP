const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

// Create Stripe Connect Account for Landlord
// Create Stripe Connect Account for Landlord
exports.createStripeAccount = async (req, res) => {
  const { landlordId } = req.body; // Get landlord ID from request body
  console.log(req.body);

  try {
    // Check if the landlord exists by ID
    const user = await User.findById(landlordId); // Find landlord by ID
    if (!user) {
      return res.status(404).json({ error: "Landlord not found" });
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email, // Use the user's email from the database
      business_type: "individual",
    });

    // Generate account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://yourapp.com/manage-payments", // URL for refreshing
      return_url: "https://yourapp.com/manage-payments", // URL to return after onboarding
      type: "account_onboarding",
    });

    // Update the landlord's Stripe account ID in the database
    await User.updateOne(
      { _id: landlordId }, // Find landlord by ID
      { stripeAccountId: account.id } // Update their Stripe account ID
    );

    res.status(200).json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    res.status(500).json({ error: error.message });
  }
};
// Create Stripe Customer for Tenant
exports.createCustomer = async (req, res) => {
  const { tenantId } = req.body; // Get tenant ID from request body

  try {
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: req.body.email, // Tenant's email
    });

    // Update the tenant's record in your database with the Stripe customer ID
    await User.updateOne(
      { _id: tenantId }, // Find tenant by ID
      { stripeCustomerId: customer.id } // Save the Stripe customer ID
    );

    res.status(200).json({ customerId: customer.id });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create Payment Intent for Tenant Rent Payment
exports.createPaymentIntent = async (req, res) => {
  const { amount, currency, landlordStripeAccountId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      payment_method_types: ["card"],
      transfer_data: {
        destination: landlordStripeAccountId, // Transfer to landlord's account
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
};
