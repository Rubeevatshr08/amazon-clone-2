const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async (req, res) => {
    const { items, email } = req.body;
    const transformedItems = items.map(item => ({
        price_data: {
            description: item.description,
            product_data: {
                name: item.title,
                images: [item.image]
            },
            unit_amount: item.price * 100,
        },
        quantity: 1
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: transformedItems,
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        metadata: {
            email,
            images: JSON.stringify(items.map(item => item.image))
        }
    });
    res.status(200).json({ id: session.id });
};