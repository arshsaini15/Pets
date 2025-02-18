import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"

const app = express()

app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))



app.post('/test', (req, res) => {
    console.log('Request file:', req.file); // Log the file
    console.log('Request body:', req.body); // Log the body
    res.status(200).json({ message: "Success" });
});

// client
import userRouter from './routes/user.routes.js'
import signinRouter from './routes/signin.routes.js'
import logoutRouter from './routes/logout.routes.js'
import getprofileRouter from './routes/getprofile.routes.js'
import fetchUsersRouter from './routes/fetchusers.routes.js'
import connectUserRouter from './routes/connect.routes.js'
import personProfileRouter from './routes/personprofile.routes.js'
import editProfileRouter from './routes/editprofile.routes.js'
import emailRouter from './routes/emailroutes.js'

// admin
import adminLoginRouter from './routes/adminlogin.routes.js'
import adminProfileRouter  from "./routes/adminprofile.routes.js"
import adminRegisterRouter from './routes/adminregister.routes.js'
import adminProductRouter from './routes/admindashboard.routes.js'
import adminProductFetchRouter from './routes/adminfetchproducts.routes.js'
import adminProductDelete  from "./routes/admindeleteproducts.routes.js"

// post
import createPostRouter from './routes/createpost.routes.js'
import getPostsRouter from './routes/getposts.routes.js'

// chats
import chatListRouter from './routes/chatlist.routes.js'
import chatUsersRouter from './routes/chatusers.routes.js'
import chatSaveRouter from './routes/chatsave.routes.js'
import chatHistoryRouter from './routes/chathistory.routes.js'
import connectionPetsRouter from './routes/connectionpets.routes.js'

// pets
import getPetsRouter from './routes/getpets.routes.js'
import allPetsRouter from './routes/allpets.routes.js'
import petProfileRouter from './routes/getpetprofile.routes.js'
import petsNearMeRouter from './routes/petnearme.routes.js'

// products
import productDetailsRouter from './routes/productdetail.routes.js'

// discuss
import discussAddPostRouter from './routes/discussaddpost.routes.js'
import getAllDiscussionsRouter from './routes/discussallposts.routes.js'
import LikePostRouter from './routes/discusslikepost.routes.js'
import AddCommentRouter from './routes/discusscomments.routes.js'

// cart
import AddToCartRouter from './routes/addtocart.routes.js'
import showCartRouter from './routes/showcart.routes.js'

// client
app.use("/api/v1/users", userRouter)
app.use("/api/v1/users", signinRouter)
app.use("/api/v1/users", logoutRouter)
app.use("/api/v1/users", getprofileRouter)
app.use("/api/v1/users", fetchUsersRouter)
app.use("/api/v1/users", connectUserRouter)
app.use("/api/v1/users", personProfileRouter)
app.use("/api/v1/users", editProfileRouter)
app.use("/api/v1/users", emailRouter)

// admin
app.use("/api/v1/admin", adminLoginRouter)
app.use("/api/v1/admin", adminProfileRouter)
app.use("/api/v1/admin", adminRegisterRouter)
app.use("/api/v1/admin", adminProductRouter)
app.use("/api/v1/admin", adminProductFetchRouter)
app.use("/api/v1/admin", adminProductDelete);

// post 
app.use("/api/v1/posts", getPostsRouter)

// chats
app.use("/api/v1/chats", chatListRouter)
app.use("/api/v1/chats", chatUsersRouter)
app.use("/api/v1/chats", chatSaveRouter)
app.use("/api/v1/chats", chatHistoryRouter)

// pets
app.use("/api/v1/pets", getPetsRouter)
app.use("/api/v1/pets", connectionPetsRouter)
app.use("/api/v1/pets", createPostRouter)
app.use("/api/v1/pets", allPetsRouter)
app.use("/api/v1/pets", petProfileRouter)
app.use("/api/v1/pets", petProfileRouter)
app.use("/api/v1/pets", petsNearMeRouter)

// discuss
app.use("/api/v1/discuss", discussAddPostRouter)
app.use("/api/v1/discuss", getAllDiscussionsRouter)
app.use("/api/v1/discuss", LikePostRouter)
app.use("/api/v1/discuss", AddCommentRouter)

// cart
app.use("/api/v1/cart", AddToCartRouter)
app.use("/api/v1/cart", showCartRouter)

// product
app.use("/api/v1/products", productDetailsRouter)

export { app }