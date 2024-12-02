// Import required modules
const express = require("express");
const { getCoursesByStudentId } = require("../../controllers/student-controller/student-courses-controller");

// Create an instance of the Express router
const router = express.Router();

/**
 * Get a list of courses for a specific student by their ID.
 * @route GET /get/:studentId
 * @param {string} studentId - The ID of the student whose courses are to be retrieved.
 * @returns {Array} A list of courses associated with the specified student.
 */
router.get("/get/:studentId", getCoursesByStudentId);

// Export the router to be used in the main application
module.exports = router;