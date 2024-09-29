const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

async function login(req, res) {
    const { Email, Password } = req.body
    if(!Email || !Password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const user = await User.findOne({ Email }).lean().exec()
    if(!user) return res.status(400).json({'message': 'User Not Found!'})

    const correctPwd = await bcrypt.compare(Password, user.Password)
    if(!correctPwd) return res.status(400).json({'message': 'Password Is Wrong!'})

    const accessToken = jwt.sign(
        {
            "user": {
                "id": user._id,
                "email": user.Email,
                "username": user.UserName,
                "role": user.Role
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    const refreshToken = jwt.sign(
        {
            "email": user.Email
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    )
    res.cookie('jwt', 
    refreshToken, 
    { 
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken })
}

async function refresh(req, res)
{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({'message': 'Unauthorized By Server!'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ Email: decoded.email }).exec()

            console.log(decoded)

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "user": {
                        "id": foundUser._id,
                        "email": foundUser.Email,
                        "username": foundUser.UserName,
                        "role": foundUser.Role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )

            res.json({ accessToken })
        }
    )
}

async function logout(req, res)
{
    res.clearCookie('jwt')
    res.json({'message': 'Logged Out Successfully!'})
}

module.exports = {
    login,
    refresh,
    logout
}