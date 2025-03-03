import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled", "delivered"],
            default: "pending"
        },
        paymentId: {
            type: String
        },
        razorpaySignature: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);