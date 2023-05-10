import { Router } from 'express'
import morgan from 'morgan'
import {
    UserController,
    UnitController,
    TransactionController,
    TestController,
    ProductController,
    CategoryController,
    BuyerController,
    VendorController,
    SalesOrderController,
    PurchaseOrderController
} from '../Controllers/index.js'

const Api = Router()
Api.use(morgan('tiny'))
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
Api.use('/category', CategoryController())
Api.use('/buyer', BuyerController())
Api.use('/vendor', VendorController())
Api.use('/sales-order', SalesOrderController())
Api.use('/purchase-order', PurchaseOrderController())

export default Api

