const Stripe = require('stripe');

// Replace with your Stripe secret key
const stripe = Stripe('your-secret-key');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { amount, currency } = body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount should be in the smallest currency unit (e.g., cents for USD)
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};
