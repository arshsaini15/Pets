import jwt from 'jsonwebtoken'

export const verifyAdmin = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err.message)
            return res.status(403).json({ message: "Invalid or expired token" })
        }

        // console.log('Decoded token:', decoded)
        req.admin = { _id: decoded.id, email: decoded.email, role: decoded.role }
        next()
    })

}