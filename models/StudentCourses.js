// Import the required modules
const mongoose = require("mongoose");

// Define the Course schema for individual course details
const CourseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true, // Ensure courseId is provided
    },
    title: {
        type: String,
        required: true, // Ensure title is provided
    },
    instructorId: {
        type: String,
        required: true, // Ensure instructorId is provided
    },
    instructorName: {
        type: String,
        required: true, // Ensure instructorName is provided
    },
    dateOfPurchase: {
        type: Date,
        default: Date.now, // Default to current date if not specified
    },
    courseImage: {
        type: String,
        required: true, // Ensure courseImage is provided
    },
});

// Define the Student Courses schema
const StudentCoursesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // Ensure userId is provided
    },
    courses: [CourseSchema], // Array of course details using the Course schema
});

// Export the StudentCourses model
module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);