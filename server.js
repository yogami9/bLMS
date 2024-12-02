// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import route modules
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

// Initialize the Express application
const app = express();

// Set up constants for PORT and MONGO_URI
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"; // Fallback for local development

// Middleware configuration
app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,  // Allow cookies or authorization headers
}));

app.use(express.json()); // Parse incoming JSON requests

// Database connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// Start the server on the defined port
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
  console.log(`CORS is enabled for: ${CLIENT_URL}`);
});