import User from '../Model/User.js'

//user auth middleware
const UserAuth = async (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }
    // verify auth credentials
    let [accessToken, id] = req.headers.authorization.replace('Bearer ', '').split('-')
    let user = await User.findById(id),
        userData = user ? { ...user._doc, id: id } : null
    if (user && userData.role === 'user') {
        req.user = userData
        next()
    }
    else
        res.status(400).json({
            status: false,
            message: 'Invalid access token.',
            data: null
        })
}

export default UserAuth