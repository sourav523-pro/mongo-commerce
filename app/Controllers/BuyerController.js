import { Router } from 'express'
import { body, check } from 'express-validator'
import { UserAuth } from '../Middleware/index.js'
import Buyer from '../Model/Buyer.js'
import Validator from '../Validator/Validator.js'

const BuyerController = () => {
    const router = Router()
    //user auth middleware
    router.use(UserAuth)

    router.get('/:id', async (req, res) => {
        try {
            let buyer = await Buyer.findById(req.params.id)
            if (buyer)
                return res.status(200).json({
                    status: true,
                    message: 'Buyer fetched',
                    data: buyer
                })
            else
                return res.status(40).json({
                    status: false,
                    message: 'Buyer not found',
                    error: buyer
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
            let buyers = await Buyer.find(findSettings).sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                message: 'Buyer fetched',
                count: buyers.length,
                data: buyers
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
        body('name').exists(),
        body('email', "Please enter a valid email address.").isEmail(),
        body('phone').isMobilePhone(),
        body('status').isIn(['active', 'inactive']),
        body('email').custom(async (email) => {
            let existingBuyer = await Buyer.findOne({ email: email })
            if (existingBuyer) {
                return Promise.reject('Buyer already exists')
            }
        })
    ]), async (req, res) => {
        try {
            let body = req.body

            let buyer = new Buyer({
                userId: req.user.id,
                name: body.name,
                companyName: body.companyName,
                email: body.email,
                phone: body.phone,
                status: body.status,
                address: []
            })
            body.address && body.address.forEach((item) => {
                buyer.address.push(item)
            })
            buyer.save()
            return res.status(201).json({
                status: true,
                message: 'Buyer created',
                data: buyer
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
        body('name').exists(),
        body('email', "Please enter a valid email address.").isEmail(),
        body('phone').isMobilePhone(),
        body('status').isIn(['active', 'inactive']),
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    name: body.name,
                    status: body.status,
                    email: body.email,
                    phone: body.phone
                }
            let buyer = await Buyer.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'Buyer updated',
                data: buyer
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
            let del = await Buyer.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'Buyer deleted',
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

export default BuyerController