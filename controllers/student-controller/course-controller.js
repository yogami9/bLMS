// Import necessary models
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Handler to get all courses with filtering and sorting
const getAllStudentViewCourses = async (req, res) => {
    try {
        const {
            category = [],
            level = [],
            primaryLanguage = [],
            sortBy = "price-lowtohigh",
        } = req.query;

        // Construct filters based on query parameters
        let filters = {};
        if (category.length) {
            filters.category = { $in: category.split(",") };
        }
        if (level.length) {
            filters.level = { $in: level.split(",") };
        }
        if (primaryLanguage.length) {
            filters.primaryLanguage = { $in: primaryLanguage.split(",") };
        }

        // Construct sorting parameter
        let sortParam = {};
        switch (sortBy) {
            case "price-lowtohigh":
                sortParam.pricing = 1; // Ascending order
                break;
            case "price-hightolow":
                sortParam.pricing = -1; // Descending order
                break;
            case "title-atoz":
                sortParam.title = 1; // Ascending order
                break;
            case "title-ztoa":
                sortParam.title = -1; // Descending order
                break;
            default:
                sortParam.pricing = 1; // Default to ascending price
                break;
        }

        // Fetch and sort courses based on the filters and sorting parameters
        const coursesList = await Course.find(filters).sort(sortParam);
        
        // Return the list of courses
        return res.status(200).json({
            success: true,
            data: coursesList,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching courses!",
        });
    }
};

// Handler to get course details by ID
const getStudentViewCourseDetails = async (req, res) => {
    try {
        const { id } = req.params; // Extract course ID from params
        const courseDetails = await Course.findById(id); // Find the course by ID
        
        // Check if the course exists
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "No course details found",
                data: null,
            });
        }

        // Return the course details
        return res.status(200).json({
            success: true,
            data: courseDetails,
        });
    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching course details!",
        });
    }
};

// Handler to check if a student has purchased a course
const checkCoursePurchaseInfo = async (req, res) => {
    try {
        const { id, studentId } = req.params; // Extract course ID and student ID from params
        const studentCourses = await StudentCourses.findOne({ userId: studentId }); // Find the student's courses

        // Check if the student has already bought the current course
        const hasPurchased = studentCourses.courses.some(item => item.courseId === id);

        // Return the purchase status
        return res.status(200).json({
            success: true,
            data: hasPurchased,
        });
    } catch (error) {
        console.error("Error checking course purchase info:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while checking course purchase information!",
        });
    }
};

// Export the handlers
module.exports = {
    getAllStudentViewCourses,
    getStudentViewCourseDetails,
    checkCoursePurchaseInfo,
};