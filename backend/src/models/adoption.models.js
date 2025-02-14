import mongoose from "mongoose";

const adoptionApplicationSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
});

module.exports = mongoose.model("AdoptionApplication", adoptionApplicationSchema);