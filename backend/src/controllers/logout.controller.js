import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const logoutUser = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (token === null) {
        throw new ApiError(401, "User not authenticated");
    }

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });
});

export { logoutUser };