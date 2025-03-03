import express from "express"
import { Order } from "../models/order.models.js"
import { authenticateUser } from '../middlewares/auth.js'
import { razorpayInstance } from '../utils/razorpay.js'

const router = express.Router();

router.post("/create-order", authenticateUser, async (req, res) => {
    try {
        const { amount, currency = "INR", address } = req.body;
        const userId = req.userId; // Extract user ID from authentication middleware

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const options = {
            amount: amount,
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // Save order in MongoDB
        const newOrder = new Order({
            user: userId,
            orderId: order.id,
            amount,
            address,
            status: "pending",
        });

        await newOrder.save();

        res.json({ order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

export default router