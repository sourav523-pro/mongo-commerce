import { Router } from 'express'
import AuthRoutes from './auth.js'
import UserRoutes from './user.js'
const Api = Router()
Api.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'This is the api path. Go next to your route',
    })
})

Api.use('/auth', AuthRoutes)
Api.use('/user', UserRoutes)
// Api.use('/transaction', TransactionController())
// Api.use('/unit', UnitController())
// Api.use('/product', ProductController())
// Api.use('/category', CategoryController())
// Api.use('/buyer', BuyerController())
// Api.use('/vendor', VendorController())
// Api.use('/sales-order', SalesOrderController())
// Api.use('/purchase-order', PurchaseOrderController())

export default Api

