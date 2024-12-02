// Import required modules
const express = require("express");
const multer = require("multer");
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../../helpers/cloudinary");

// Create an instance of the Express router
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

/**
 * Upload a single file to Cloudinary.
 * @route POST /upload
 * @param {string} file - The file to upload.
 */
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // Upload the file to Cloudinary
        const result = await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error uploading file" });
    }
});

/**
 * Delete a media asset from Cloudinary by its ID.
 * @route DELETE /delete/:id
 * @param {string} id - The ID of the asset to delete.
 */
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check for required asset ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Asset ID is required",
            });
        }

        // Delete the asset from Cloudinary
        await deleteMediaFromCloudinary(id);
        res.status(200).json({
            success: true,
            message: "Asset deleted successfully from Cloudinary",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting file" });
    }
});

/**
 * Upload multiple files to Cloudinary.
 * @route POST /bulk-upload
 * @param {Array} files - The files to upload.
 */
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
    try {
        // Create an array of upload promises
        const uploadPromises = req.files.map((file) =>
            uploadMediaToCloudinary(file.path)
        );

        // Wait for all uploads to finish
        const results = await Promise.all(uploadPromises);
        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in bulk uploading files" });
    }
});

// Export the router to be used in the main application
module.exports = router;