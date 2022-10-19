import { Router } from 'express'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import Unit from '../Model/Unit.js'
import AdminAuth from '../Middleware/AdminAuth.js'
import { getDateByDuration } from './CommonFunction.js'


const UnitController = () => {
    const router = Router()
    //user auth middleware
    router.use(AdminAuth)

    router.get('/:id', async (req, res) => {
        try {
            let unit = await Unit.findById(req.params.id)
            if (unit)
                return res.status(200).json({
                    status: true,
                    message: 'Unit fetched',
                    data: unit
                })
            else
                return res.status(401).json({
                    status: false,
                    message: 'Unit not found',
                    error: unit
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
            let units = await Unit.find().sort({ createdAt: -1 })
            return res.status(200).json({
                status: true,
                message: 'Unit fetched',
                count: units.length,
                data: units
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
        body('unit').exists(),
        body('type').isIn(['weight', 'dimension', 'inventory']),
        body('unit').custom(async (unit) => {
            let existingUnit = await Unit.findOne({ unit: unit })
            if (existingUnit) {
                return Promise.reject('Unit already exists')
            }
        })
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    unit: body.unit,
                    type: body.type,
                }
            let unit = await Unit.create(inputData)
            return res.status(201).json({
                status: true,
                message: 'Unit created',
                data: unit
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
        body('unit').notEmpty(),
        body('type').isIn(['weight', 'dimension', 'inventory'])
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    unit: body.unit,
                    type: body.type,
                }
            let unit = await Unit.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'Unit updated',
                data: { ...unit._doc, ...inputData }
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
            let unit = await Unit.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'Unit deleted',
                data: unit
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

export default UnitController