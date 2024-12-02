// Import Cloudinary SDK
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload media to Cloudinary
 * @param {string} filePath - Path to the media file to upload
 * @returns {Object} The result of the upload operation
 * @throws {Error} If uploading to Cloudinary fails
 */
const uploadMediaToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto", // Automatically determines the resource type
        });
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Error uploading to Cloudinary");
    }
};

/**
 * Delete media from Cloudinary using its public ID
 * @param {string} publicId - The public ID of the Cloudinary resource to delete
 * @throws {Error} If deleting the asset from Cloudinary fails
 */
const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        throw new Error("Failed to delete asset from Cloudinary");
    }
};

// Export the upload and delete functions
module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };