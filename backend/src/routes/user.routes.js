import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()


// router.route("/register").post(
//     upload.fields([
//         {
//             name: "profileImage",
//             maxCount: 1
//         },
//     ]),
//     registerUser 
// )


router.post('/register', upload.single('profileImage'), registerUser);


export default router