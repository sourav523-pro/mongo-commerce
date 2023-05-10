import { Router } from 'express'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import { Product, ProductVariant, Inventory } from '../Model/index.js'
import { UserAuth } from '../Middleware/index.js'
import { getDateByDuration } from './CommonFunction.js'


const ProductController = () => {
    const router = Router()
    //user auth middleware
    router.use(UserAuth)

    //get specific product
    router.get('/:id', async (req, res) => {
        try {
            let product = await Product.findById(req.params.id).populate('categories').populate('variants')
            if (product)
                return res.status(200).json({
                    status: true,
                    message: 'Product fetched',
                    data: product
                })
            else
                return res.status(400).json({
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
    //get all product 
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
            let products = await Product.find(findSettings).populate('categories').populate('variants').sort({ createdAt: 'desc' }).limit(limit).skip(limit * (page - 1))
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
    //create a product 
    router.post('/', Validator([
        body('status').isIn(['active', 'inactive', 'draft']),
        body('title').exists(),
        body('status').exists(),
    ]), async (req, res) => {
        try {
            let body = req.body
            let product = new Product({
                userId: req.user.id,
                title: body.title,
                slug: body.title.toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, ''),
                status: body.status,
                price: body.price,
                description: body.description || null,
                body_html: body.body_html || null,
                vendor: body.vendor || null,
                tax: body.tax || 0,
                product_meta: [],
                images: [],
                variants: []
            })
            body.images && body.images.forEach((item) => {
                product.images.push(item)
            })
            body.categories && body.categories.forEach((item) => {
                product.categories.push(item)
            })
            body.product_meta && body.product_meta.forEach((item) => {
                product.product_meta.push(item)
            })
            product.save()
            let savedProduct = await Product.findById(product._doc._id).populate('catgories')
            return res.status(201).json({
                status: true,
                message: 'Product created',
                data: savedProduct
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //update a product
    router.put('/:id', Validator([
        body('status').isIn(['active', 'inactive', 'draft']),
        body('title').exists(),
        body('status').exists(),
    ]), async (req, res) => {
        try {
            let exists = Product.findById(req.params.id)
            if (exists) {
                let body = req.body,
                    inputData = {}

                if (body.title) {
                    inputData.title = body.title;
                    inputData.slag = body.title.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^\w-]+/g, '');
                }
                body.status ? inputData.status = body.status : null;
                body.price ? inputData.price = body.price : null;
                body.description ? inputData.description = body.description || null : null;
                body.body_html ? inputData.body_html = body.body_html || null : null;
                body.vendor ? inputData.vendor = body.vendor || null : null;
                body.tax ? inputData.tax = body.tax || 0 : null;
                body.categories ? inputData.categories = body.categories || [] : null;
                body.images ? inputData.images = body.images || [] : null;
                body.product_meta ? inputData.product_meta = body.product_meta || [] : null;

                let product = await Product.findByIdAndUpdate(req.params.id, inputData).populate('categories').populate('variants')

                return res.status(201).json({
                    status: true,
                    message: 'Product updated ',
                    data: product
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Product not found',
                    error: {
                        productId: 'Invalid product ' + req.params.id
                    },
                    data: null
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //delete a product
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
    //variants part
    //get specific variant 
    router.get('/:productid/variant/:variantid', async (req, res) => {
        try {
            ProductVariant.findOne({
                _id: req.params.variantid,
                productId: req.params.productid,
            }).populate('inventory').exec((err, variant) => {
                if (variant)
                    return res.status(200).json({
                        status: true,
                        message: 'Product variants fetched',
                        data: variant || {}
                    })
                else
                    return res.status(400).json({
                        status: false,
                        message: 'Product variants',
                        error: variant || {}
                    })
            });

        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //get all variants of a specific product
    router.get('/:productid/variant', async (req, res) => {
        let limit = req.query.limit || 100,
            page = Math.max(0, req.params.page || 1)
        try {
            let variant = await ProductVariant.find({
                productId: req.params.productid,
            }).populate('inventory').sort({ createdAt: -1 }).limit(limit).skip(limit * (page - 1));
            if (variant)
                return res.status(200).json({
                    status: true,
                    message: 'Product variants fetched',
                    data: variant || {}
                })
            else
                return res.status(400).json({
                    status: false,
                    message: 'Product variants',
                    error: variant || {}
                })
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //create product variant
    router.post('/:productid/variant', Validator([
        body('status').isIn(['active', 'inactive', 'draft']),
        body('title').exists(),
        body('price').exists(),
        body('sku').exists(),
        body('weight').exists(),
        body('weightUnit').exists(),
        body('manageInventory').exists(),
        body('inventoryUnit').exists(),
        body('currency').exists(),
    ]), async (req, res) => {
        try {
            let body = req.body
            let product = await Product.findById(req.params.productid)
            if (product) {
                let productVariant = new ProductVariant({
                    productId: product._id || null,
                    title: body.title || product.title,
                    status: body.status || 'draft',
                    price: body.price || 0,
                    cost: body.cost || null,
                    sku: body.sku,
                    barcode: body.barcode || null,
                    position: body.position || 0,
                    weight: body.weight || null,
                    weightUnit: body.weightUnit || null,
                    manageInventory: body.manageInventory || 'Y',
                    inventoryUnit: body.inventoryUnit || null,
                    currency: body.currency || 'INR',
                })
                let productInventory = new Inventory({
                    productId: product._id,
                    variantId: productVariant._doc._id,
                    sku: productVariant._doc.sku,
                    starting: 0,
                    sales: 0,
                    purchase: 0,
                    prevStock: 0,
                    available: 0,
                    allocated: 0,
                    onhand: 0,
                    inventoryUnit: productVariant._doc.inventoryUnit,
                })
                productVariant.inventory = productInventory._doc._id
                productVariant.save()
                productInventory.save()
                Product.findByIdAndUpdate(req.params.productid,
                    { $push: { variants: productVariant._doc._id } },
                    { new: true, useFindAndModify: false }
                ).exec()
                return res.status(200).json({
                    status: true,
                    message: 'Product variants saved',
                    data: { ...productVariant._doc, inventory: productInventory._doc }
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Product not found',
                    error: {
                        productId: 'Invalid product' + req.params.productid
                    },
                    data: null
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: false,
                message: err.message,
                error: err,
                data: null
            })
        }
    })
    //update specific product variant
    router.put('/:productid/variant/:variantid', Validator([
        body('status').isIn(['active', 'inactive', 'draft']),
        body('title').exists(),
        body('price').exists(),
        body('sku').exists(),
        body('weight').exists(),
        body('weightUnit').exists(),
        body('manageInventory').exists(),
        body('inventoryUnit').exists(),
        body('currency').exists(),
    ]), async (req, res) => {
        try {
            let body = req.body
            let variant = await ProductVariant.findOne({
                productId: req.params.productid,
                _id: req.params.variantid
            })
            if (variant) {
                let inputData = {
                    title: body.title,
                    status: body.status || 'draft',
                    price: body.price || 0,
                    cost: body.cost || null,
                    sku: body.sku,
                    barcode: body.barcode || null,
                    position: body.position || key,
                    weight: body.weight || null,
                    weightUnit: body.weightUnit || null,
                    manageInventory: body.manageInventory || 'Y',
                    inventoryUnit: body.inventoryUnit || null,
                    currency: body.currency || 'INR',
                }
                let productVariant = ProductVariant.findByIdAndUpdate(req.params.id, inputData)
                return res.status(200).json({
                    status: true,
                    message: 'Product variants updated',
                    data: { ...productVariant._doc, ...inputData }
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Product variants not found',
                    error: {
                        productId: 'Invalid product variants' + req.params.productid
                    },
                    data: null
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    })
    //delete specific product variant
    router.delete('/:productid/variant/:variantid', async (req, res) => {
        try {
            let variant = await ProductVariant.find({
                _id: req.params.variantid,
                productId: req.params.productid,
            });
            if (variant) {
                let del = await ProductVariant.findByIdAndDelete(req.params.variantid)
                return res.status(200).json({
                    status: true,
                    message: 'Product variants delete',
                    data: variant || {}
                })
            }
            else
                return res.status(400).json({
                    status: false,
                    message: 'Product variant not found',
                    error: variant || {}
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