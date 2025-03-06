import { User } from "../models/user.models.js";
import { Pet } from "../models/pet.models.js";

// Add pet to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { petId } = req.body;
        const userId = req.userId;

        if (!petId) return res.status(400).json({ message: "Pet ID is required" });

        // Check if pet exists
        const pet = await Pet.findById(petId);
        if (!pet) return res.status(404).json({ message: "Pet not found" });

        // Update user's favorites
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favourites: petId } }, // Prevents duplicates
            { new: true }
        ).populate("favourites");

        res.status(200).json({ message: "Pet added to favorites", favourites: user.favourites });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log("Fetching wishlist for user:", userId);

        const user = await User.findById(userId).populate("favourites");

        if (!user) {
            console.error("User not found:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Wishlist fetched successfully:", user.favourites);
        res.status(200).json({ favourites: user.favourites });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Remove pet from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favourites: petId } },
            { new: true }
        ).populate("favourites");

        res.status(200).json({ message: "Pet removed from favorites", favourites: user.favourites });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
