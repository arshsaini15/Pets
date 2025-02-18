import mongoose from "mongoose"

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
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
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
    location: {
        type: {
            type: String,
            enum: ["Point"], // GeoJSON format
            default: "Point",
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true, // Ensure coordinates are always provided
        },
        address: {
            type: String,
        },
    },
}, { timestamps: true });

petSchema.index({ location: "2dsphere" });

export const Pet = mongoose.model('Pet', petSchema);