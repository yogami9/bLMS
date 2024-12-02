// Import required models
const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Handler to mark the current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
    try {
        const { userId, courseId, lectureId } = req.body;

        // Check if progress exists for the user and course
        let progress = await CourseProgress.findOne({ userId, courseId });

        // Initialize progress if not found
        if (!progress) {
            progress = new CourseProgress({
                userId,
                courseId,
                lecturesProgress: [{
                    lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                }],
            });
            await progress.save();
        } else {
            // Update progress for the specific lecture
            const lectureProgress = progress.lecturesProgress.find(
                (item) => item.lectureId === lectureId
            );
            if (lectureProgress) {
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            } else {
                progress.lecturesProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                });
            }
            await progress.save();
        }

        // Fetch course details to check progress against
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if all lectures have been viewed
        const allLecturesViewed = progress.lecturesProgress.length === course.curriculum.length &&
            progress.lecturesProgress.every((item) => item.viewed);

        // Update completion status if all lectures viewed
        if (allLecturesViewed) {
            progress.completed = true;
            progress.completionDate = new Date();
            await progress.save();
        }

        res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            data: progress,
        });
    } catch (error) {
        console.error("Error marking lecture as viewed:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while marking lecture as viewed.",
        });
    }
};

// Handler to get current course progress
const getCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // Check if the course was purchased by the user
        const studentPurchasedCourses = await StudentCourses.findOne({ userId });
        const isPurchased = studentPurchasedCourses?.courses.some(
            (item) => item.courseId === courseId
        );

        if (!isPurchased) {
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: "You need to purchase this course to access it.",
            });
        }

        // Fetch current course progress
        const currentUserCourseProgress = await CourseProgress.findOne({
            userId,
            courseId,
        });

        // If no progress found, return course details
        if (!currentUserCourseProgress || currentUserCourseProgress?.lecturesProgress.length === 0) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "No progress found, you can start watching the course",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                },
            });
        }

        // Return progress if found
        const courseDetails = await Course.findById(courseId);
        res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lecturesProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true,
            },
        });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching course progress.",
        });
    }
};

// Handler to reset the course progress
const resetCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        const progress = await CourseProgress.findOne({ userId, courseId });

        // Check if progress exists before resetting
        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "Progress not found!",
            });
        }

        // Reset progress
        progress.lecturesProgress = [];
        progress.completed = false;
        progress.completionDate = null;
        await progress.save();

        res.status(200).json({
            success: true,
            message: "Course progress has been reset",
            data: progress,
        });
    } catch (error) {
        console.error("Error resetting course progress:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while resetting course progress.",
        });
    }
};

// Export the handlers
module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress,
};