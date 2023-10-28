const paypalPayouts = require('@paypal/payouts-sdk');
const paypalCheckout = require('@paypal/checkout-server-sdk');

// Initialize PayPal SDK

//Checkout: SENDER -> COMPANY
const environmentCheckout = new paypalCheckout.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const clientCheckout = new paypalCheckout.core.PayPalHttpClient(environmentCheckout);

//Payouts: COMPANY -> RECEIVER
const environmentPayouts = new paypalPayouts.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const clientPayouts = new paypalPayouts.core.PayPalHttpClient(environmentPayouts);

//Payouts
exports.handlePayout = async (req, res) => {
    const { email, amount } = req.body;

    const requestBody = {
        sender_batch_header: {
            recipient_type: "EMAIL",
            email_message: "You have received a payout!"
        },
        items: [{
            recipient_type: "EMAIL",
            receiver: email,
            amount: {
                value: amount,
                currency: "USD"
            }
        }]
    };

    const request = new paypalPayouts.payouts.PayoutsPostRequest();
    request.requestBody(requestBody);

    try {
        const response = await clientPayouts.execute(request);
        if (response.statusCode === 201) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

//Checkout
exports.createPayment = async (req, res) => {
    const request = new paypalCheckout.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: req.body.amount
            }
        }],
        application_context: {
            // Change these URLs to reflect your WebView handling
            // The return_url is where PayPal will redirect upon a successful payment
            return_url: "YOUR_WEBVIEW_SUCCESS_URL",
            cancel_url: "YOUR_WEBVIEW_CANCEL_URL"
        }
    });

    try {
        const order = await clientCheckout.execute(request);
        res.json({ orderID: order.result.id });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

//Checkout part 2
exports.capturePayment = async (req, res) => {
    const orderID = req.body.orderID;

    const request = new paypalCheckout.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await clientCheckout.execute(request);
        const captureID = capture.result.purchase_units[0].payments.captures[0].id;
        res.json({ captureID });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
