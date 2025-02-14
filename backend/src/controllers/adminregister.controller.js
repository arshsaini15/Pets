import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from 'bcryptjs';
import { Admin } from "../models/admin.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken';

const adminRegister = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    console.log('request body: ', req.body);
    console.log('request file: ', req.file);

    if ([email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await Admin.findOne({
        $or: [{ username }, { email }]
    });

    if (existedAdmin) {
        throw new ApiError(409, "User already exists");
    }

    const profileImageLocalPath = req.file?.path;
    console.log('profile image local path: ', profileImageLocalPath);

    let profileImageUrl = null;
    let profileImagePublicId = null;

    if (profileImageLocalPath) {
        try {
            const response = await uploadOnCloudinary(profileImageLocalPath);
            console.log('profile image url: ', response);
            if (response) {
                profileImageUrl = response.url;
                profileImagePublicId = response.public_id;
                console.log('Profile image uploaded to Cloudinary');
            }
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new ApiError(500, "Failed to upload profile image");
        }
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new ApiError(500, "Error hashing password");
    }

    let admin;
    try {
        admin = await Admin.create({
            profileImage: profileImageUrl,
            profileImagePublicId: profileImagePublicId,
            email,
            password: hashedPassword,
            username,
        });
        console.log('Admin created:', admin);
    } catch (error) {
        console.error('Error creating admin:', error);
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");
    if (!createdAdmin) {
        throw new ApiError(500, "Failed to retrieve created user");
    }

    const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(201).json({
        accessToken: token,
        admin: createdAdmin,
    });
});

export { adminRegister };
