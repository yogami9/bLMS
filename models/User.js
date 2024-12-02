// Import the required modules
const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true, // Ensure userName is provided
        trim: true, // Remove leading/trailing whitespace
    },
    userEmail: {
        type: String,
        required: true, // Ensure userEmail is provided
        unique: true, // Ensure the email is unique
        lowercase: true, // Convert email to lowercase for consistency
        trim: true, // Remove leading/trailing whitespace
        validate: {
            validator: function (v) {
                // Simple regex for email validation
                return /^([\w-]+(?:\.[\w-]+)*)@([\w-]{1,}\.[a-z]{2,})$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`, // Custom error message
        },
    },
    password: {
        type: String,
        required: true, // Ensure password is provided
        minlength: 6, // Minimum length for password
    },
    role: {
        type: String,
        enum: ["user", "admin", "moderator"], // Possible roles
        default: "user", // Default role if not specified
    },
});

// Export the User model
module.exports = mongoose.model("User", UserSchema);