const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        return res.status(401).json({ message: "Authentication token required" })
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userData) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "Token expired. Please signIn again" })
        }
        req.user = userData // store payload for next handler
        next() // continue to protected route

    })
}

module.exports = { authenticateToken }




// const userData = jwt.verify(token, process.env.JWT_SECRET_KEY)
// if (!userData) return res.status(403).json({ message: "Token expired. Please signIn again" })
// req.user = userData // store payload for next handler
// next() // continue to protected route