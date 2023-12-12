import bcrypt from 'bcrypt'
import User from '../Model/User.js'
import { getDateByDuration } from './CommonFunction.js'

export const getUsers = async (req, res) => {
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
}
export const getUser = async (req, res) => {
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
}
export const createUser = async (req, res) => {
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
}
export const updateUser = async (req, res) => {
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
}
export const deleteUser = async (req, res) => {
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
}

const UserController = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
export default UserController