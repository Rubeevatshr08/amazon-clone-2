const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async (req, res) => {
    const { items, email } = req.body;
    console.log(items, email);
    // Items are passed from the client to the server
    // Create Checkout Sessions from body params
};