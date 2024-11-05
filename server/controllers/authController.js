const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Tourist = require('../models/Tourist')
const Admin = require('../models/Admin')
const Advertiser = require('../models/Advertiser')
const Seller = require('../models/Seller')
const TourGuide = require('../models/Tourguide')    
const TourismGovernor = require('../models/TourismGovernor')

async function login(req, res) {
    const { UserName, Password } = req.body
    if(!UserName || !Password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const foundUser = await User.findOne({ UserName }).lean().exec()
    if(!foundUser) return res.status(400).json({'message': 'User Not Found!'})

    if(foundUser.RequestDelete) return res.status(400).json({'message': 'User Requested To Delete!'})

    const correctPwd = await bcrypt.compare(Password, foundUser.Password)
    if(!correctPwd) return res.status(400).json({'message': 'Password Is Wrong!'})


    let user
    if(foundUser.Role === 'Tourist') user = await Tourist.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if(foundUser.Role === 'Admin') user = await Admin.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if(foundUser.Role === 'Advertiser') user = await Advertiser.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if(foundUser.Role === 'Seller') user = await Seller.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if(foundUser.Role === 'TourGuide') user = await TourGuide.findOne({ UserId: foundUser._id }, "_id").lean().exec()
    else if(foundUser.Role === 'TourismGovernor') user = await TourismGovernor.findOne({ UserId: foundUser._id }, "_id").lean().exec()


    const accessToken = jwt.sign(
        {
            "user": {
                "userId": foundUser._id,
                "id": user._id,
                "email": foundUser.Email,
                "username": foundUser.UserName,
                "role": foundUser.Role
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    const refreshToken = jwt.sign(
        {
            "email": foundUser.Email
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    )
    // res.cookie('jwt', 
    // refreshToken, 
    // { 
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'None',
    //     maxAge: 30 * 24 * 60 * 60 * 1000
    // })

    res.status(200).json({ accessToken, refreshToken, user: {...foundUser, userId: foundUser._id, _id: user._id } })
}

async function refresh(req, res)
{
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const refreshToken = authHeader.split(' ')[1]

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ Email: decoded.email }).lean().exec()

            let user
            if(foundUser?.Role === 'Tourist') user = await Tourist.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if(foundUser?.Role === 'Admin') user = await Admin.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if(foundUser?.Role === 'Advertiser') user = await Advertiser.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if(foundUser?.Role === 'Seller') user = await Seller.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if(foundUser?.Role === 'TourGuide') user = await TourGuide.findOne({ UserId: foundUser._id }, "_id").lean().exec()
            else if(foundUser?.Role === 'TourismGovernor') user = await TourismGovernor.findOne({ UserId: foundUser._id }, "_id").lean().exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "user": {
                        "userId": foundUser._id,
                        "id": user._id,
                        "email": foundUser.Email,
                        "username": foundUser.UserName,
                        "role": foundUser.Role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )

            res.json({ accessToken, refreshToken, user: {...foundUser, userId: foundUser._id, _id: user._id } })
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