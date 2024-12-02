// Import the required modules
const mongoose = require("mongoose");

// Define the Lecture schema
const LectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Make title a required field
    },
    videoUrl: {
        type: String,
        required: true, // Make videoUrl a required field
    },
    public_id: {
        type: String,
        required: true, // required in case you want to store cloud storage ids
    },
    freePreview: {
        type: Boolean,
        default: false, // Default to false if not specified
    },
});

// Define the Course schema
const CourseSchema = new mongoose.Schema({
    instructorId: {
        type: String,
        required: true, // Ensure instructorId is provided
    },
    instructorName: {
        type: String,
        required: true, // Ensure instructorName is provided
    },
    date: {
        type: Date,
        default: Date.now, // Default to current date if not specified
    },
    title: {
        type: String,
        required: true, // Ensure title is provided
    },
    category: {
        type: String,
        required: true, // Ensure category is provided
    },
    level: {
        type: String,
        required: true, // Ensure level is provided
    },
    primaryLanguage: {
        type: String,
        required: true, // Ensure primaryLanguage is provided
    },
    subtitle: {
        type: String,
        required: true, // Ensure subtitle is provided
    },
    description: {
        type: String,
        required: true, // Ensure description is provided
    },
    image: {
        type: String,
        required: true, // Ensure image is provided
    },
    welcomeMessage: {
        type: String,
        required: true, // Ensure welcomeMessage is provided
    },
    pricing: {
        type: Number,
        required: true, // Ensure pricing is provided
    },
    objectives: {
        type: String,
    },
    students: [
        {
            studentId: {
                type: String,
                required: true, // Ensure studentId is provided
            },
            studentName: {
                type: String,
                required: true, // Ensure studentName is provided
            },
            studentEmail: {
                type: String,
                required: true, // Ensure studentEmail is provided
            },
            paidAmount: {
                type: String,
                required: true, // Ensure paidAmount is provided
            },
        },
    ],
    curriculum: [LectureSchema],
    isPublished: {
        type: Boolean,
        default: false, // Default to false if not specified
    },
});

// Export the Course model
module.exports = mongoose.model("Course", CourseSchema);