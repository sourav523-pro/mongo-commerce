import { Router } from 'express'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import Product from '../Model/Product.js'
import UserAuth from '../Middleware/UserAuth.js'
import { getDateByDuration } from './CommonFunction.js'


const ProductController = () => {
    const router = Router()
    //user auth middleware
    router.use(UserAuth)

    router.get('/:id', async (req, res) => {
        try {
            let product = await Product.findById(req.params.id)
            if (product)
                return res.status(200).json({
                    status: true,
                    message: 'Product fetched',
                    data: product
                })
            else
                return res.status(401).json({
                    status: false,
                    message: 'Product not found',
                    error: product
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
            let products = await Product.find(findSettings).sort({ createdAt: -1 }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                message: 'Products fetched',
                count: products.length,
                data: products,
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
    router.post('/', Validator([
        body('status').isIn(['actve', 'inactive', 'draft']),
        body('title').exists(),
        body('sku').exists(),
        body('inventoryUnit').exists(),
        body('status').exists(),
        body('price').isFloat(),
        body('items').isArray(),
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    userId: req.user.id,
                    ...body
                }
            let product = await Product.create(inputData)
            return res.status(201).json({
                status: true,
                message: 'Product created',
                data: product
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    router.put('/:id', async (req, res) => {
        try {
            let body = req.body,
                productExists = await Product.findOne({ _id: req.params.id, userId: req.user.id })

            if (productExists) {
                let product = await Product.findByIdAndUpdate(req.params.id, body)
                return res.status(200).json({
                    status: true,
                    message: 'Product updated',
                    data: { ...product._doc, ...inputData }
                })
            } else {
                res.status(404).json({ status: false, message: 'Product not found', data: body })
            }
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
            let product = await Product.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'Product deleted',
                data: product
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

export default ProductController