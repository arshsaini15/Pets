import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    profilePublicId: {
        type: String,
    },
    pets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",  // References Pet documents for each user
        },
    ],
    favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",  // Stores reference to favorited pets for adoption
        },
    ],
    adoptionApplications: [
        {
            petId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pet",
            },
            status: {
                type: String,
                enum: ["pending", "approved", "rejected"],
                default: "pending",
            },
            applicationDate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    reminders: [
        {
            title: String,
            description: String,
            date: Date,
            isComplete: {
                type: Boolean,
                default: false,
            },
        },
    ],
    communityPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",  // References posts made by the user in the community feed
        },
    ],
    bio: {
        type: String,
        maxLength: 500,
    },
    location: {
        type: String,
    },
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    hiddenUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // stores references to users that should be hidden
        },
    ],
}, { timestamps: true });

// Password hashing before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // only hash the password if it is modified
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next(); // continue the save process
    } catch (error) {
        next(error); // pass the error to the next middleware
    }
})

// Method to check if the password matches
userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password); // compare the given password with the hashed password
    } catch (error) {
        throw new Error("Password comparison failed.")
    }
}

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    );
};

export const User = mongoose.model("User", userSchema)