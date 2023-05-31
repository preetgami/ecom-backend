const stripe = require('stripe')(`${process.env.STRIPE_KEY}`);
const express = require('express');

const YOUR_DOMAIN = 'https://ecom-site-7cfad.firebaseapp.com/';
const router = express.Router()

router.post('/create-checkout-session', async (req, res) => {
    const line_items = req.body.cartitems.map(item => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.image],
                    description: item.description
                },
                unit_amount: parseFloat(item.price).toFixed(1) * 100,
            },
            quantity: 1
        }
    })
    const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
            allowed_countries: ['US', 'CA'],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500,
                        currency: 'usd',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 1,
                        },
                    },
                },
            },
        ],
        line_items,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/checkout-success`,
        cancel_url: `${YOUR_DOMAIN}/`,
    });

    res.send({ url: session.url });
});

module.exports = router
