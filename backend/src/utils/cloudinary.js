import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary credentials are missing.");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const uploadOnCloudinary = async (localFilePath, retries = 3) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided.");
            return null;
        }

        try {
            fs.accessSync(localFilePath);
        } catch (err) {
            console.error(`File does not exist at path: ${localFilePath}`, err);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            timeout: 120000, 
        });

        if (response && response.secure_url) {
            await fs.promises.unlink(localFilePath)
            console.log(`Successfully uploaded to Cloudinary. Secure URL: ${response.secure_url}`);
            return {
                url: response.secure_url,
                public_id: response.public_id,
                ...response 
            };
        } else {
            console.error("Failed to upload the file. No secure URL returned.");
            throw new Error("No secure URL returned.");
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message || error)
        console.error(error)

        if (retries > 0) {
            console.log(`Retrying upload... Attempts left: ${retries}`)
            await sleep(3000)
            return await uploadOnCloudinary(localFilePath, retries - 1)
        } else {
            try {
                await fs.promises.unlink(localFilePath);
                console.log(`Deleted local file after retries failed: ${localFilePath}`);
            } catch (err) {
                console.error("Error deleting local file:", err);
            }
        }
        return null
    }
}