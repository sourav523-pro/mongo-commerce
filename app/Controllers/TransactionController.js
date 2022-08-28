import { Router } from 'express'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import Transaction from '../Model/Transaction.js'
import UserAuth from '../Middleware/UserAuth.js'
import { getDateByDuration } from './CommonFunction.js'


const TransactionController = () => {
    const router = Router()
    //user auth middleware
    router.use(UserAuth)

    router.get('/:id', async (req, res) => {
        try {
            let transaction = await Transaction.findById(req.params.id)
            if (transaction)
                return res.status(200).json({
                    status: true,
                    message: 'Transaction fetched',
                    data: transaction
                })
            else
                return res.status(401).json({
                    status: false,
                    message: 'Transaction not found',
                    error: transaction
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
                type = req.query.type,
                duration = req.query.duration,
                limit = req.query.limit || 100,
                page = Math.max(0, req.params.page || 1)
            if (type && type != 'all')
                findSettings.type = type
            if (duration && duration != 'alltime') {
                let durationVal = getDateByDuration(duration)
                findSettings.createdAt = {
                    $gte: durationVal.start,
                    $lte: durationVal.end
                }
            }
            let transactions = await Transaction.find(findSettings).sort({ createdAt: -1 }).limit(limit).skip(limit * (page - 1))
            return res.status(200).json({
                status: true,
                message: 'Transactions fetched',
                count: transactions.length,
                data: transactions,
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
        body('amount').isFloat(),
        body('type').isIn(['expense', 'income', 'debt', 'lend'])
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    userId: req.user.id,
                    amount: body.amount,
                    type: body.type,
                    note: body.note || ""
                }
            let transaction = await Transaction.create(inputData)
            return res.status(201).json({
                status: true,
                message: 'Transaction created',
                data: transaction
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
        body('amount').isFloat(),
        body('type').isIn(['expense', 'income', 'debt', 'lend'])
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    userId: req.user.id,
                    amount: body.amount,
                    type: body.type,
                    note: body.note || ""
                }
            let transaction = await Transaction.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'Transaction updated',
                data: { ...transaction._doc, ...inputData }
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
            let transaction = await Transaction.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'Transaction deleted',
                data: transaction
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

export default TransactionController