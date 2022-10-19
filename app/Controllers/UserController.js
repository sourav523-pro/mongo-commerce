import bcrypt from 'bcrypt'
import { Router } from 'express'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import User from '../Model/User.js'
import AdminAuth from '../Middleware/AdminAuth.js'
import { getDateByDuration } from './CommonFunction.js'

const UserController = () => {
    const userRoute = Router()
    //signup route
    userRoute.post('/signup', Validator([
        body('userName').exists(),
        body('email', 'Please provide a valid email address').isEmail(),
        body('password').isLength({ min: 8 }),
        body('phone').isMobilePhone(),
        body('role', 'Please give a specific role').isIn(['user', 'admin']),
        body('email').custom(async (email) => {
            let user = await User.findOne({ email: email })
            if (user) {
                return Promise.reject('E-mail already in use')
            }
        })
    ]), async (req, res) => {
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
    })
    //login route
    userRoute.post('/login', Validator([
        body('email', 'Please provide a valid email address').isEmail(),
        body('password').isLength({ min: 8 }),
    ]), async (req, res) => {
        try {
            let { email, password } = req.body
            const user = await User.findOne({ email: email })
            let verifyPassword = await bcrypt.compare(password, user.password)
            if (user && verifyPassword) {
                let salt = await bcrypt.genSalt(10),
                    accessToken = await bcrypt.hash(user.email, salt),
                    { password, ...userData } = user._doc,
                    randString = Math.random().toString(),
                    token = accessToken + '-' + user.id + randString
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

    })
    // userRoute.use(AdminAuth)
    //get all user
    userRoute.get('/', AdminAuth, async (req, res) => {
        let findSettings = { role: 'user' },
            type = req.query.type,
            duration = req.query.duration,
            limit = req.query.limit || 100,
            page = Math.max(0, req.params.page || 1)
        if (type && type != 'all')
            findSettings.type = type
        if (duration && duration != 'alltime') {
            let durationVal = getDateByDuration(duration)
            findSettings.createdAt = {
                $gte: durationVal.start,
                $lte: durationVal.end
            }
        }
        try {
            let users = await User.find(findSettings).sort({ createdAt: -1 }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                count: users.length,
                data: users,
                searchSettings: findSettings
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //get single user
    userRoute.get('/:id', AdminAuth, async (req, res) => {
        try {
            let user = await User.findById(req.params.id)
            return res.status(200).json({
                status: true,
                message: "User fetched",
                data: user
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //create a user
    userRoute.post('/', AdminAuth,
        Validator([
            body('userName').exists(),
            body('email', 'Please provide a valid email address').isEmail(),
            body('password').isLength({ min: 8 }),
            body('phone').isMobilePhone(),
            body('role', 'Please give a specific role').isIn(['user', 'admin']),
            body('email').custom(async (email) => {
                let user = await User.findOne({ email: email })
                if (user) {
                    return Promise.reject('E-mail already in use')
                }
            })
        ])
        , async (req, res) => {
            try {
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
                const user = await User.create(userData)
                let { password, ...savedData } = user._doc
                return res.status(200).json({
                    status: true,
                    message: "User created",
                    data: savedData
                })
            } catch (err) {
                return res.status(500).json({
                    status: false,
                    message: err.message,
                    data: null
                })
            }
        })
    //update single user
    userRoute.put('/:id', AdminAuth,
        Validator([
            body('userName').exists(),
            body('email', 'Please provide a valid email address').isEmail(),
            body('phone').isMobilePhone(),
            body('role', 'Please give a specific role').isIn(['user'])
        ])
        , async (req, res) => {
            try {

                let body = req.body, newData = {
                    userName: body.userName,
                    businessName: body.businessName || "",
                    email: body.email,
                    phone: body.phone,
                    role: body.role,
                    address: body.address
                }
                let user = await User.findById(req.params.id)
                if (user.email != body.email) {
                    let findEmail = await User.findOne({ email: email })
                    if (findEmail)
                        return res.status(401).json({
                            status: false,
                            message: 'E-mail already in use',
                            data: body
                        })
                }
                if (body.password) {
                    let salt = await bcrypt.genSalt(10)
                    newData.password = await bcrypt.hash(body.password, salt)
                }
                user = await User.findByIdAndUpdate(req.params.id, newData)
                //extracting password from user data
                let { password, ...savedData } = { ...user._doc, ...newData } //updating fetched user value with requested value
                return res.status(200).json({
                    status: true,
                    message: "User updated",
                    data: savedData,
                })
            } catch (err) {
                return res.status(500).json({
                    status: false,
                    message: err.message,
                    data: null
                })
            }
        })
    //delete single user
    userRoute.delete('/:id', AdminAuth, async (req, res) => {
        try {
            let user = await User.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: "User deleted.",
                data: user
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    return userRoute
}

export default UserController