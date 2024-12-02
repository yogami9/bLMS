// Import the required modules
const mongoose = require("mongoose");

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // Ensure userId is provided
    },
    userName: {
        type: String,
        required: true, // Ensure userName is provided
    },
    userEmail: {
        type: String,
        required: true, // Ensure userEmail is provided
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled", "Refunded"], // Example statuses
        required: true, // Ensure orderStatus is provided
    },
    paymentMethod: {
        type: String,
        required: true, // Ensure paymentMethod is provided
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"], // Example payment status
        required: true, // Ensure paymentStatus is provided
    },
    orderDate: {
        type: Date,
        default: Date.now, // Default to current date if not specified
    },
    paymentId: {
        type: String,
        required: true, // Ensure paymentId is provided
    },
    payerId: {
        type: String,
        required: true, // Ensure payerId is provided
    },
    instructorId: {
        type: String,
        required: true, // Ensure instructorId is provided
    },
    instructorName: {
        type: String,
        required: true, // Ensure instructorName is provided
    },
    courseImage: {
        type: String,
        required: true, // Ensure courseImage is provided
    },
    courseTitle: {
        type: String,
        required: true, // Ensure courseTitle is provided
    },
    courseId: {
        type: String,
        required: true, // Ensure courseId is provided
    },
    coursePricing: {
        type: String,
        required: true, // Ensure coursePricing is provided
    },
});

// Export the Order model
module.exports = mongoose.model("Order", OrderSchema);