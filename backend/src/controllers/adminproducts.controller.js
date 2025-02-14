import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const adminProducts = asyncHandler(async (req, res) => {

    const { name, price, stock, description, brand } = req.body
    console.log(req.body);
    

    if (!req.file) {
        throw new ApiError(400, "Profile image is required")
    }

    if ([price, name].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const profileImageLocalPath = req.file.path
    console.log('profile image local path: ',profileImageLocalPath)

    let profileImageUrl = null
    let profileImagePublicId = null


    if (profileImageLocalPath) {
        const response = await uploadOnCloudinary(profileImageLocalPath)
        console.log('profile image url: ',response)
        
        if (response) {
            profileImageUrl = response.url
            profileImagePublicId = response.public_id
            console.log('Profile image uploaded to Cloudinary')
        } else {
            throw new ApiError(500, "Failed to upload profile image")
        }
    }



    const product = await Product.create({
        imageUrl: profileImageUrl,
        name,
        stock,
        description,
        brand,
        price
    })


    res.status(201).json({
        accessToken: process.env.ACCESS_TOKEN,
    })
})

export { adminProducts }