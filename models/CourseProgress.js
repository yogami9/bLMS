// Import the required modules
const mongoose = require("mongoose");

// Define the Lecture Progress schema
const LectureProgressSchema = new mongoose.Schema({
    lectureId: {
        type: String,
        required: true, // Ensure lectureId is provided
    },
    viewed: {
        type: Boolean,
        default: false, // Default to false if not specified
    },
    dateViewed: {
        type: Date,
        required: true, // Ensure dateViewed is provided
    },
});

// Define the Course Progress schema
const CourseProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // Ensure userId is provided
    },
    courseId: {
        type: String,
        required: true, // Ensure courseId is provided
    },
    completed: {
        type: Boolean,
        default: false, // Default to false if not specified
    },
    completionDate: {
        type: Date,
    },
    lecturesProgress: [LectureProgressSchema], // Array of Lecture Progress documents
});

// Export the Course Progress model
module.exports = mongoose.model("Progress", CourseProgressSchema);