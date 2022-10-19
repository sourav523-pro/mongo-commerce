import { Router } from 'express'
import UserController from '../Controllers/UserController.js'
import TransactionController from '../Controllers/TransactionController.js'
import UnitController from '../Controllers/UnitController.js'
import TestController from '../Controllers/TestController.js'
import ProductController from '../Controllers/ProductController.js'

const Api = Router();
Api.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'This is the api path. Go next to your route',
    })
})

Api.use('/test', TestController())
Api.use('/user', UserController())
Api.use('/transaction', TransactionController())
Api.use('/unit', UnitController())
Api.use('/product', ProductController())

export default Api;

