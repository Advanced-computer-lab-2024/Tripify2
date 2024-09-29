const jwt = require('jsonwebtoken')

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.username = decoded.user.username
            req.role = decoded.user.role
            if(decoded.user.role === 'Admin' || decoded.user.role === 'Admin') next()
            else return res.status(403).json({ message: 'Forbidden' })
        }
    )
}

module.exports = verifyAdmin