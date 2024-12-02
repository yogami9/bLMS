// Import required modules
const express = require("express");
const {
    getStudentViewCourseDetails,
    getAllStudentViewCourses,
    checkCoursePurchaseInfo
} = require("../../controllers/student-controller/course-controller");

// Create an instance of the Express router
const router = express.Router();

/**
 * Get all courses available for a student to view.
 * @route GET /get
 * @returns {Array} List of all courses for the student.
 */
router.get("/get", getAllStudentViewCourses);

/**
 * Get detailed information about a specific course.
 * @route GET /get/details/:id
 * @param {string} id - The ID of the course.
 * @returns {Object} Detailed information for the specified course.
 */
router.get("/get/details/:id", getStudentViewCourseDetails);

/**
 * Check purchase information for a specific course for a given student.
 * @route GET /purchase-info/:id/:studentId
 * @param {string} id - The ID of the course.
 * @param {string} studentId - The ID of the student.
 * @returns {Object} Purchase information related to the specified course and student.
 */
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

// Export the router to be used in the main application
module.exports = router;