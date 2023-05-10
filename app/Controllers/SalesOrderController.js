import { Router } from 'express'
import { body, check } from 'express-validator'
import { UserAuth } from '../Middleware/index.js'
import { getDateByDuration, getDate, rand } from './CommonFunction.js'
import SalesOrder from '../Model/SalesOrder.js'
import SalesOrderItem from '../Model/SalesOrderItem.js'
import Validator from '../Validator/Validator.js'

const SalesOrderController = () => {
    const router = Router()

    //user auth middleware
    router.use(UserAuth)

    router.get('/:id', async (req, res) => {
        try {
            let salesOrder = await SalesOrder.findById(req.params.id).populate('orderItem').populate('buyer')
            if (salesOrder)
                return res.status(200).json({
                    status: true,
                    message: 'SalesOrder fetched',
                    data: salesOrder
                })
            else
                return res.status(40).json({
                    status: false,
                    message: 'SalesOrder not found',
                    error: salesOrder
                })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })

    router.get('/', async (req, res) => {
        try {
            let findSettings = { userId: req.user.id },
                status = req.query.status,
                duration = req.query.duration,
                limit = req.query.limit || 100,
                page = Math.max(0, req.params.page || 1)
            if (status && status != 'all') {
                findSettings.status = status
            }
            if (duration && duration != 'alltime') {
                let durationVal = getDateByDuration(duration)
                findSettings.createdAt = {
                    $gte: durationVal.start,
                    $lte: durationVal.end
                }
            }
            let salesOrders = await SalesOrder.find(findSettings).populate('orderItem').populate('buyer').sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                message: 'SalesOrder fetched',
                count: salesOrders.length,
                data: salesOrders
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })

    router.post('/', Validator([
        body('buyer').exists(),
        body('orderNumber').exists(),
        body('status').isIn(['on_hold', 'pending', 'processing', 'shipped', 'refunded', 'completed']),
        body('shippingDate').exists(),
        body('shippingName').exists(),
        body('shippingEmail').exists(),
        body('shippingPhone').exists(),
        body('shippingAddress1').exists(),
        body('shippingCity').exists(),
        body('shippingPostCode').exists(),
        body('shippingCountry').exists(),
        body('shippingState').exists(),
        body('paymentMethod').exists(),
        body('paymentAmount').exists(),
        body('orderItems').isArray()
    ]), async (req, res) => {
        try {
            let body = req.body
            let salesOrder = new SalesOrder({
                userId: req.user.id,
                buyer: body.buyer,
                orderNumber: body.orderNumber,
                channel: body.channel || "",
                status: body.status,
                orderDate: getDate('YYYY-MM-DD'),
                shippingDate: body.shippingDate,
                shippingMethod: body.shippingMethod || '',
                shippingTerms: body.shippingTerms || '',
                shippingName: body.shippingName,
                shippingEmail: body.shippingEmail,
                shippingPhone: body.shippingPhone || '',
                shippingAddress1: body.shippingAddress1,
                shippingAddress2: body.shippingAddress2 || '',
                shippingCity: body.shippingCity,
                shippingPostCode: body.shippingPostCode,
                shippingCountry: body.shippingCountry,
                shippingState: body.shippingState,
                invoiceNumber: body.invoiceNumber || rand(1000),
                billingName: body.sameAsShipping ? body.shippingName : body.billingName,
                billingEmail: body.sameAsShipping ? body.shippingEmail : body.billingEmail,
                billingPhone: body.sameAsShipping ? body.shippingPhone || '' : body.billingPhone || '',
                billingAddress1: body.sameAsShipping ? body.shippingAddress1 : body.billingAddress1,
                billingAddress2: body.sameAsShipping ? body.shippingAddress2 || '' : body.billingAddress2 || '',
                billingCity: body.sameAsShipping ? body.shippingCity : body.billingCity,
                billingPostCode: body.sameAsShipping ? body.shippingPostCode : body.billingPostCode,
                billingCountry: body.sameAsShipping ? body.shippingCountry : body.billingCountry,
                billingState: body.sameAsShipping ? body.shippingState : body.billingState,
                notes: body.notes || '',
                subtotal: 0,
                total: 0,
                tax: body.tax || 0,
                discount: body.discount || 0,
                paymentMethod: body.paymentMethod || '',
                paymentAmount: body.paymentAmount || 0,
                paymentDetails: body.paymentDetails || '{}',
                orderItems: []
            });
            let subtotal = 0
            body.orderItems && body.orderItems.forEach((item) => {
                let orderItem = new SalesOrderItem({
                    orderId: salesOrder._doc._id,
                    productId: item.productId,
                    sku: item.sku,
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                    discount: item.discount || 0,
                })
                orderItem.save()
                salesOrder.orderItems.push(orderItem._doc._id)
                subtotal += item.price
            })
            let total = subtotal - salesOrder.discount + salesOrder.tax
            salesOrder.subtotal = subtotal
            salesOrder.total = total
            salesOrder.save()
            return res.status(201).json({
                status: true,
                message: 'Sales order created',
                data: salesOrder
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })

    router.put('/:id', Validator([
        body('buyer').exists(),
        body('orderNumber').exists(),
        body('status').isIn(['on_hold', 'pending', 'processing', 'shipped', 'refunded', 'completed']),
        body('shippingDate').exists(),
        body('shippingName').exists(),
        body('shippingEmail').exists(),
        body('shippingPhone').exists(),
        body('shippingAddress1').exists(),
        body('shippingCity').exists(),
        body('shippingPostCode').exists(),
        body('shippingCountry').exists(),
        body('shippingState').exists(),
        body('paymentMethod').exists(),
        body('paymentAmount').exists(),
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    buyer: body.buyer,
                    orderNumber: body.orderNumber,
                    channel: body.channel || "",
                    status: body.status,
                    shippingDate: body.shippingDate,
                    shippingMethod: body.shippingMethod || '',
                    shippingTerms: body.shippingTerms || '',
                    shippingName: body.shippingName,
                    shippingEmail: body.shippingEmail,
                    shippingPhone: body.shippingPhone || '',
                    shippingAddress1: body.shippingAddress1,
                    shippingAddress2: body.shippingAddress2 || '',
                    shippingCity: body.shippingCity,
                    shippingPostCode: body.shippingPostCode,
                    shippingCountry: body.shippingCountry,
                    shippingState: body.shippingState,
                    billingName: body.sameAsShipping ? body.shippingName : body.billingName,
                    billingEmail: body.sameAsShipping ? body.shippingEmail : body.billingEmail,
                    billingPhone: body.sameAsShipping ? body.shippingPhone || '' : body.billingPhone || '',
                    billingAddress1: body.sameAsShipping ? body.shippingAddress1 : body.billingAddress1,
                    billingAddress2: body.sameAsShipping ? body.shippingAddress2 || '' : body.billingAddress2 || '',
                    billingCity: body.sameAsShipping ? body.shippingCity : body.billingCity,
                    billingPostCode: body.sameAsShipping ? body.shippingPostCode : body.billingPostCode,
                    billingCountry: body.sameAsShipping ? body.shippingCountry : body.billingCountry,
                    billingState: body.sameAsShipping ? body.shippingState : body.billingState,
                    notes: body.notes || '',
                    paymentMethod: body.paymentMethod || '',
                    paymentAmount: body.paymentAmount || 0,
                    paymentDetails: body.paymentDetails || '{}',
                }
            let salesOrder = await SalesOrder.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'SalesOrder updated',
                data: salesOrder
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })

    router.delete('/:id', async (req, res) => {
        try {
            let del = await SalesOrder.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'SalesOrder deleted',
                data: del
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })

    return router
}

export default SalesOrderController