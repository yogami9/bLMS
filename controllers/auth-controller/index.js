// Import necessary modules
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Handler for user registration
const registerUser = async (req, res) => {
    try {
        // Destructure the request body
        const { userName, userEmail, password, role } = req.body;

        // Check if user already exists by email or username
        const existingUser = await User.findOne({
            $or: [{ userEmail }, { userName }],
        });

        // Handle case where user already exists
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User name or user email already exists",
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            userName,
            userEmail,
            role,
            password: hashPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Return success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });
        
    } catch (error) {
        // Handle any errors that occurred during registration
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Handler for user login
const loginUser = async (req, res) => {
    try {
        // Destructure the request body
        const { userEmail, password } = req.body;

        // Check if user exists
        const checkUser = await User.findOne({ userEmail });

        // Validate user credentials
        if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "120m" }
        );

        // Return success response with token and user info
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                accessToken,
                user: {
                    _id: checkUser._id,
                    userName: checkUser.userName,
                    userEmail: checkUser.userEmail,
                    role: checkUser.role,
                },
            },
        });
        
    } catch (error) {
        // Handle any errors that occurred during login
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Export the user authentication handlers
module.exports = { registerUser, loginUser };