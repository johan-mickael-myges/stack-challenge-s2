exports.getPayPalClientId = (req, res) => {
    const clientId = process.env.PAYPAL_CLIENT_ID;

    if (!clientId) {
        return res.status(500).json({ error: 'PayPal client ID not configured' });
    }
    res.json({ clientId });
};
