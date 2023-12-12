import { Router } from 'express'
import { body, check } from 'express-validator'
import User from '../Model/User.js'
import Validator from '../Validator/Validator.js'

const AuthRoutes = () => {
    const routes = Router()
    //signup route
    routes.post('/signup', Validator([
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
    ]), register)

    //login route
    routes.post('/login', Validator([
        body('email', 'Please provide a valid email address').isEmail(),
        body('password').isLength({ min: 8 }),
    ]), login)

    return routes
}

export default AuthRoutes