// Import required modules
const express = require("express");
const {
    getCurrentCourseProgress,
    markCurrentLectureAsViewed,
    resetCurrentCourseProgress
} = require("../../controllers/student-controller/course-progress-controller");

// Create an instance of the Express router
const router = express.Router();

/**
 * Get the current progress of a user in a specified course.
 * @route GET /get/:userId/:courseId
 * @param {string} userId - The ID of the user.
 * @param {string} courseId - The ID of the course.
 * @returns {Object} The current progress of the specified user and course.
 */
router.get("/get/:userId/:courseId", getCurrentCourseProgress);

/**
 * Mark a specified lecture as viewed for the current user.
 * @route POST /mark-lecture-viewed
 * @body {Object} - The lecture details (should include relevant identifiers)
 * @returns {Object} Success message and updated progress.
 */
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);

/**
 * Reset the progress of the current course for the user.
 * @route POST /reset-progress
 * @body {Object} - Identifiers needed to reset progress (e.g., userId and courseId).
 * @returns {Object} Success message indicating progress has been reset.
 */
router.post("/reset-progress", resetCurrentCourseProgress);

// Export the router to be used in the main application
module.exports = router;