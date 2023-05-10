import { Router } from 'express'
import { body, check } from 'express-validator'
import { UserAuth } from '../Middleware/index.js'
import { getDateByDuration, getDate, rand } from './CommonFunction.js'
import PurchaseOrder from '../Model/PurchaseOrder.js'
import PurchaseOrderItem from '../Model/PurchaseOrderItem.js'
import Validator from '../Validator/Validator.js'

const PurchaseOrderController = () => {
    const router = Router()
    //user auth middleware
    router.use(UserAuth)
    router.get('/:id', async (req, res) => {
        try {
            let purchaseOrder = await PurchaseOrder.findById(req.params.id).populate('orderItem').populate('vendor')
            if (purchaseOrder)
                return res.status(200).json({
                    status: true,
                    message: 'PurchaseOrder fetched',
                    data: purchaseOrder
                })
            else
                return res.status(40).json({
                    status: false,
                    message: 'PurchaseOrder not found',
                    error: purchaseOrder
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
            let purchaseOrders = await PurchaseOrder.find(findSettings).populate('orderItem').populate('vendor').sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                message: 'PurchaseOrder fetched',
                count: purchaseOrders.length,
                data: purchaseOrders
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
        body('vendor').exists(),
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
            let purchaseOrder = new PurchaseOrder({
                userId: req.user.id,
                vendor: body.vendor,
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
                let orderItem = new PurchaseOrderItem({
                    orderId: purchaseOrder._doc._id,
                    productId: item.productId,
                    sku: item.sku,
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                    discount: item.discount || 0,
                })
                orderItem.save()
                purchaseOrder.orderItems.push(orderItem._doc._id)
                subtotal += item.price
            })
            let total = subtotal - purchaseOrder.discount + purchaseOrder.tax
            purchaseOrder.subtotal = subtotal
            purchaseOrder.total = total
            purchaseOrder.save()
            return res.status(201).json({
                status: true,
                message: 'PurchaseOrder created',
                data: purchaseOrder
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
        body('vendor').exists(),
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
                    vendor: body.vendor,
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
            let purchaseOrder = await PurchaseOrder.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'PurchaseOrder updated',
                data: purchaseOrder
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
            let del = await PurchaseOrder.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'PurchaseOrder deleted',
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

export default PurchaseOrderController