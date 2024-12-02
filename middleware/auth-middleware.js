// Import the jsonwebtoken library
const jwt = require("jsonwebtoken");

/**
 * Verifies the provided JWT token using the specified secret key.
 * @param {string} token - The JWT token to be verified.
 * @param {string} secretKey - The secret key used for verification.
 * @returns {Object} The decoded payload of the token if valid.
 * @throws {JsonWebTokenError} throws if the token is invalid.
 */
const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey);
};

/**
 * Middleware to authenticate a user via JWT.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void}
 */
const authenticate = (req, res, next) => {
    // Check for the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated",
        });
    }

    // Extract the token from the authorization header
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token and attach the payload to the request object
        const payload = verifyToken(token, process.env.JWT_SECRET);
        req.user = payload;
        next(); // Pass control to the next middleware
    } catch (error) {
        // Handle errors related to invalid tokens
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

// Export the authentication middleware
module.exports = authenticate;