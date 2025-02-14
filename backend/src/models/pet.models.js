import mongoose from 'mongoose'

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
    },
    age: {
        type: Number,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    // adoptionStatus: {
    //     type: String,
    //     enum: ["Available", "Adopted", "Not Available"],
    //     default: "available",
    // },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
    ],
}, { timestamps: true })

export const Pet = mongoose.model('Pet', petSchema)