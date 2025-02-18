import { User } from '../models/user.models.js'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "login",
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export const requestEmailUpdate = async (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user.id;

    console.log("Incoming email change request for userId:", userId);
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user);

        user.pendingEmail = newEmail;
        await user.save();

        console.log("Pending email saved:", newEmail);

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Generated JWT token:", token);

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

        console.log("Verification link:", verificationLink);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: newEmail,
            subject: "Confirm Your Email Change",
            html: `<p>Click the link below to confirm your email update:</p>
                   <a href="${verificationLink}">${verificationLink}</a>`,
        });

        console.log("Email sent to:", newEmail);

        res.json({ message: "Verification email sent! Please check your inbox." });

    } catch (error) {
        console.error("Email update error:", error);
        res.status(500).json({ message: "Failed to send verification email.", error: error.message });
    }
};


export const verifyEmailUpdate = async (req, res) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId)
        if (!user) return res.status(404).json({ message: "User not found" })

        if (!user.pendingEmail) return res.status(400).json({ message: "No email change request found." })

        // Confirm the new email and clear pendingEmail
        user.email = user.pendingEmail
        user.pendingEmail = null
        await user.save()

        res.send("Email updated successfully! You can now log in with your new email.")
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." })
    }
}