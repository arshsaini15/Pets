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
            index: "2dsphere", // Enables geospatial queries
        },
        address: {
            type: String,
        },
    },
}, { timestamps: true });

export const Pet = mongoose.model('Pet', petSchema);