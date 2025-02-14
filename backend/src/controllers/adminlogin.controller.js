import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from 'bcryptjs';
import { Admin } from '../models/admin.models.js'
import jwt from 'jsonwebtoken'

export const adminLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if ([email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const admin = await Admin.findOne({ email })

    if(!admin){
        throw new ApiError(409, "Email is not correct")
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password)
    
    if (!isPasswordCorrect) {
        throw new ApiError(409, "Password is not correct")
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.ADMIN_TOKEN_SECRET, {
        expiresIn: process.env.ADMIN_TOKEN_EXPIRY,
    })


    res.json({
        success: true, 
        admin: {
            email: admin.email,
            password: admin.password,
        },
        token,
        message: "Login successful",
    })
})