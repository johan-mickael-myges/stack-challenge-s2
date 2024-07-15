exports.getPayPalClientId = (req, res) => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    console.log("PayPal Client ID:", clientId); // Debug log to verify the value
    if (!clientId) {
        return res.status(500).json({ error: 'PayPal client ID not configured' });
    }
    res.json({ clientId });
};
