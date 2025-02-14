import { Router } from "express";
import { adminRegister } from "../controllers/adminregister.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()


// router.route("/signup").post(
//     upload.fields([
//         {
//             name: "profileImage",
//             maxCount: 1
//         },
//     ]),
//     registerUser
// )

router.post('/signup', upload.single('profileImage'), adminRegister);


export default router