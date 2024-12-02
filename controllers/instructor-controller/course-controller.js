// Import necessary modules
const Course = require("../../models/Course");

// Handler to add a new course
const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body; // Destructure the request body
        const newlyCreatedCourse = new Course(courseData); // Create a new course instance
        
        // Save the newly created course
        const savedCourse = await newlyCreatedCourse.save();
        
        // Check if the course was saved successfully
        return res.status(201).json({
            success: true,
            message: "Course saved successfully",
            data: savedCourse,
        });
    } catch (error) {
        console.error("Error saving course:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while saving the course!",
        });
    }
};

// Handler to get all courses
const getAllCourses = async (req, res) => {
    try {
        const coursesList = await Course.find({}); // Retrieve all courses
        return res.status(200).json({
            success: true,
            data: coursesList,
        });
    } catch (error) {
        console.error("Error retrieving courses:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving courses!",
        });
    }
};

// Handler to get course details by ID
const getCourseDetailsByID = async (req, res) => {
    try {
        const { id } = req.params; // Extract course ID from request parameters
        const courseDetails = await Course.findById(id); // Find course by ID

        // Check if course exists
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }

        return res.status(200).json({
            success: true,
            data: courseDetails,
        });
    } catch (error) {
        console.error("Error retrieving course details:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving course details!",
        });
    }
};

// Handler to update course by ID
const updateCourseByID = async (req, res) => {
    try {
        const { id } = req.params; // Extract course ID from request parameters
        const updatedCourseData = req.body; // Get updated course data from request body
        
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            updatedCourseData,
            { new: true } // Return the updated document
        );

        // Check if course was found and updated
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Error updating course:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the course!",
        });
    }
};

// Export the course management handlers
module.exports = {
    addNewCourse,
    getAllCourses,
    getCourseDetailsByID,
    updateCourseByID,
};