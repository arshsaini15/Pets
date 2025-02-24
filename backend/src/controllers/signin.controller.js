import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const signedUser = asyncHandler(async (req, res) => {

    console.log('Request Body:', req.body);

    const { email, password } = req.body;


    if ([email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }


    const user = await User.findOne({ email });


    if (!user) {
        throw new ApiError(409, "Email is not correct");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(409, "Password is not correct");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });


    res.cookie('token', token, {
        httpOnly: true, // Secure token against XSS
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'strict', // Prevent CSRF
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });


    res.json({
        success: true, 
        user: {
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
        },
        userId: user._id,
        token,
        message: "Login successful",
    })
})

export { signedUser }