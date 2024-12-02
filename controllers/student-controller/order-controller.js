// Import required modules
const paystackApi = require("../../helpers/paystack");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Handler to create a new order
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            orderDate,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
        } = req.body;

        // Initialize payment with Paystack
        const createPaymentResponse = await paystackApi.post("/transaction/initialize", {
            email: userEmail,
            amount: coursePricing * 100, // Amount in kobo
            currency: "NGN",
            callback_url: `${process.env.CLIENT_URL}/payment-return`,
        });

        const { data } = createPaymentResponse;

        if (data.status) {
            // Create a new order
            const newOrder = new Order({
                userId,
                userName,
                userEmail,
                orderStatus,
                paymentMethod,
                paymentId: data.data.id, // Paystack transaction ID
                orderDate,
                instructorId,
                instructorName,
                courseImage,
                courseTitle,
                courseId,
                coursePricing,
            });
            await newOrder.save();

            // Respond with the payment authorization URL
            return res.status(201).json({
                success: true,
                data: {
                    approveUrl: data.data.authorization_url,
                    orderId: newOrder._id,
                },
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Error while initializing payment!",
            });
        }
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the order.",
        });
    }
};

// Handler to capture payment and finalize the order
const capturePaymentAndFinalizeOrder = async (req, res) => {
    try {
        const { reference } = req.body; // Reference returned from Paystack
        const order = await Order.findOne({ paymentId: reference });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order cannot be found",
            });
        }

        // Verify the payment with Paystack
        const verifyPaymentResponse = await paystackApi.get(`/transaction/verify/${reference}`);
        const { data } = verifyPaymentResponse;

        if (data.status && data.data.status === "success") {
            // Update order status to confirmed
            order.paymentStatus = "paid";
            order.orderStatus = "confirmed";
            await order.save();

            // Update student's courses
            await updateStudentCourses(order);

            // Update the course with the new student info
            await Course.findByIdAndUpdate(order.courseId, {
                $addToSet: {
                    students: {
                        studentId: order.userId,
                        studentName: order.userName,
                        studentEmail: order.userEmail,
                        paidAmount: order.coursePricing,
                    },
                },
            });

            return res.status(200).json({
                success: true,
                message: "Order confirmed",
                data: order,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed!",
            });
        }
    } catch (error) {
        console.error("Error capturing payment:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while capturing payment.",
        });
    }
};

// Helper function to update the student's courses
const updateStudentCourses = async (order) => {
    const studentCourses = await StudentCourses.findOne({ userId: order.userId });

    const newCourse = {
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
    };

    if (studentCourses) {
        // If student already has courses, add the new course
        studentCourses.courses.push(newCourse);
        await studentCourses.save();
    } else {
        // Create new student courses document if it doesn't exist
        const newStudentCourses = new StudentCourses({
            userId: order.userId,
            courses: [newCourse],
        });
        await newStudentCourses.save();
    }
};

// Exports
module.exports = {
    createOrder,
    capturePaymentAndFinalizeOrder,
};