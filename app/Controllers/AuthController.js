import bcrypt from 'bcrypt'
import User from '../Model/User.js'


export const register = async (req, res) => {
    let body = req.body,
        salt = await bcrypt.genSalt(10),
        userData = {
            userName: body.userName,
            businessName: body.businessName || "",
            email: body.email,
            phone: body.phone,
            role: body.role,
            address: body.address
        }
    userData.password = await bcrypt.hash(body.password, salt)
    try {
        const user = await User.create(userData)
        let { password, ...savedData } = user._doc
        return res.status(201).json({
            status: true,
            message: 'User created',
            data: savedData
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
            data: null
        })
    }
}
export const login = async (req, res) => {
    try {
        let { email, password } = req.body
        const user = await User.findOne({ email: email })
        let verifyPassword = await bcrypt.compare(password, user.password)
        if (user && verifyPassword) {
            let salt = await bcrypt.genSalt(10),
                accessToken = await bcrypt.hash(user.email, salt),
                { password, ...userData } = user._doc,
                randString = Math.random().toString(),
                token = accessToken + '-' + user.id + '-' + randString
            console.log(user._doc)
            return res.status(200).json({
                status: true,
                message: 'Login successful',
                data: { ...userData, accessToken: token }
            })
        } else {
            return res.status(401).json({
                status: false,
                message: 'Login failed. Invalid email or password.',
                data: null
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
            data: null
        })
    }

}

const AuthController = {
    register,
    login
}
export default AuthController