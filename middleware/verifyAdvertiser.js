const jwt = require('jsonwebtoken')

const verifyAdvertiser = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    if(process.env.ACCESS_TOKEN_SECRET)
    {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Forbidden' })
                if (typeof decoded === 'object' && decoded !== null) {
                    const user = decoded.user;
                    if (user && typeof user === 'object' && 'username' in user && 'role' in user)
                    {
                        req.username = decoded?.user?.username
                        req.role = decoded?.user?.role
                        if(decoded?.user?.role === 'Advertiser' || decoded?.user?.role === 'Admin') next()
                        else return res.status(403).json({ message: 'Forbidden' })
                    }   
                }
            }
        )
    }
}

module.exports = verifyAdvertiser