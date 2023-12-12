import { Router } from 'express'
import { body, check } from 'express-validator'
import User from '../Model/User.js'
import Validator from '../Validator/Validator.js'
import AdminAuth from '../Middleware/AdminAuth.js'
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../Controllers/UserController.js'

const UserRoutes = () => {
    const routes = Router()

    //get all user
    routes.get('/', AdminAuth, getUsers)

    //get single user
    routes.get('/:id', AdminAuth, getUser)

    //create a user
    routes.post('/', AdminAuth,
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
                } else {
                    return Promise.resolve(true)
                }
            })
        ]), createUser)

    //update single user
    routes.put('/:id', AdminAuth,
        Validator([
            body('userName').exists(),
            body('email', 'Please provide a valid email address').isEmail(),
            body('phone').isMobilePhone(),
            body('role', 'Please give a specific role').isIn(['user'])
        ]), updateUser)

    //delete single user
    routes.delete('/:id', AdminAuth, deleteUser)

    return routes
}

export default UserRoutes