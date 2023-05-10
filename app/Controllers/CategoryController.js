import { Router } from 'express'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import Category from '../Model/Category.js'
import AdminAuth from '../Middleware/AdminAuth.js'


const CategoryController = () => {
    const router = Router()
    //user auth middleware
    router.use(AdminAuth)

    router.get('/:id', async (req, res) => {
        try {
            let category = await Category.findById(req.params.id)
            if (category)
                return res.status(200).json({
                    status: true,
                    message: 'Category fetched',
                    data: category
                })
            else
                return res.status(40).json({
                    status: false,
                    message: 'Category not found',
                    error: category
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
            let categories = await Category.find().sort({ name: 'asc' })
            return res.status(200).json({
                status: true,
                message: 'Category fetched',
                count: categories.length,
                data: categories
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
        body('status').isIn(['active', 'inactive']),
        body('name').custom(async (name) => {
            let existingCategory = await Category.findOne({ name: name })
            if (existingCategory) {
                return Promise.reject('Category already exists')
            }
        })
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    name: body.name,
                    slug: body.name.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^\w-]+/g, ''),
                    status: body.status,
                    parent: body.parent || null,
                }
            let category = await Category.create(inputData)
            return res.status(201).json({
                status: true,
                message: 'Category created',
                data: category
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
        body('status').isIn(['active', 'inactive'])
    ]), async (req, res) => {
        try {
            let body = req.body,
                inputData = {
                    name: body.name,
                    slug: body.name.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^\w-]+/g, ''),
                    status: body.status,
                    parent: body.parent || null,
                }
            let category = await Category.findByIdAndUpdate(req.params.id, inputData)
            return res.status(200).json({
                status: true,
                message: 'Category updated',
                data: category
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
            let del = await Category.findByIdAndDelete(req.params.id)
            return res.status(200).json({
                status: true,
                message: 'Category deleted',
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

export default CategoryController