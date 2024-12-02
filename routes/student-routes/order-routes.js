// Import required modules
const express = require("express");
const {
    createOrder,
    capturePaymentAndFinalizeOrder
} = require("../../controllers/student-controller/order-controller");

// Create an instance of the Express router
const router = express.Router();

/**
 * Create a new order for a student.
 * @route POST /create
 * @body {Object} orderDetails - Details of the order to be created (e.g., courseId, studentId, etc.).
 * @returns {Object} Success message and order details upon creation.
 */
router.post("/create", createOrder);

/**
 * Capture payment and finalize the order.
 * @route POST /capture
 * @body {Object} paymentInfo - Information needed to capture payment (e.g., orderId, paymentMethod).
 * @returns {Object} Success message indicating that the payment has been captured and the order finalized.
 */
router.post("/capture", capturePaymentAndFinalizeOrder);

// Export the router to be used in the main application
module.exports = router;