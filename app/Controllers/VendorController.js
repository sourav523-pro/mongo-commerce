import { Router } from 'express'
import { body, check } from 'express-validator'
import { UserAuth } from '../Middleware/index.js'
import Vendor from '../Model/Vendor.js'
import Validator from '../Validator/Validator.js'

const VendorController = () => {
    const router = Router()
    //user auth middleware
    router.use(UserAuth)

    router.get('/:id', async (req, res) => {
        try {
            let vendor = await Vendor.findById(req.params.id)
            if (vendor)
                return res.status(200).json({
                    status: true,
                    message: 'Vendor fetched',
                    data: vendor
                })
            else
                return res.status(40).json({
                    status: false,
                    message: 'Vendor not found',
                    error: vendor
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
            let vendors = await Vendor.find(findSettings).sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                message: 'Vendor fetched',
                count: vendors.length,
                data: vendors
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
            let existingVendor = await Vendor.findOne({ email: email })
            if (existingVendor) {
                return Promise.reject('Vendor already exists')
            }
        })
    ]), async (req, res) => {
        try {
            let body = req.body

            let vendor = new Vendor({
                userId: req.user.id,
                name: body.name,
                companyName: body.companyName,
                email: body.email,
                phone: body.phone,
                status: body.status,
                address: []
            })
            body.address && body.address.forEach((item) => {
                vendor.address.push(item)
            })
            vendor.save()
            return res.status(201).json({
                status: true,
                message: 'Vendor created',
                data: vendor
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
            let vendor = await Vendor.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'Vendor updated',
                data: vendor
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
            let del = await Vendor.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'Vendor deleted',
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

export default VendorController