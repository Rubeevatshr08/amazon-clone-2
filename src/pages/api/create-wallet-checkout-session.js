import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
    const { amount, email } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Wallet Balance',
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${process.env.HOST}/wallet`,
        cancel_url: `${process.env.HOST}/wallet`,
        metadata: {
            email,
            amount
        },
    });
    res.status(200).json({ id: session.id });
};