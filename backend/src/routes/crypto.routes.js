import crypto from "crypto"
import { Router } from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { Order } from "../models/order.models.js"

const router = Router()

router.post("/verify-payment", authenticateUser, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const order = await Order.findOne({ orderId: razorpay_order_id });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Verify payment signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        // Update order status
        order.status = "paid";
        order.paymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        res.json({ message: "Payment verified successfully", order });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

export default router