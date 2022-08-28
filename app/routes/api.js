import { Router } from 'express'
import UserController from '../Controllers/UserController.js'
import TransactionController from '../Controllers/TransactionController.js'

const Api = Router();
Api.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'This is the api path. Go next to your route',
    })
})

Api.use('/user', UserController())
Api.use('/transaction', TransactionController())

export default Api;

