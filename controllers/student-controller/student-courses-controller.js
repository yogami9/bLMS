// Import required model
const StudentCourses = require("../../models/StudentCourses");

// Handler to get courses by student ID
const getCoursesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Fetch the courses related to the given student ID
        const studentCourses = await StudentCourses.findOne({ userId: studentId });

        // Check if the student has any courses
        if (!studentCourses || !studentCourses.courses || studentCourses.courses.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No courses found for this student.",
            });
        }

        // Respond with the list of courses
        return res.status(200).json({
            success: true,
            data: studentCourses.courses,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching courses.",
        });
    }
};

// Export the handler
module.exports = { getCoursesByStudentId };