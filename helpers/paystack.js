// Import Axios for HTTP requests
const axios = require("axios");

// Retrieve the Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Configure the Paystack API client with Axios
const paystackApi = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});

/**
 * Paystack API client for making service calls
 * @module paystackApi
 */
module.exports = paystackApi;