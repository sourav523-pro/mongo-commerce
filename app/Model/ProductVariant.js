import mongoose from "mongoose"
import Inventory from './Inventory.js'
const { Schema, model } = mongoose

const ProductVariantSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: [true, 'Please give product ID.']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please give your title']
    },
    price: {
        type: Number,
        trim: true,
        required: [true, 'Please give a price']
    },
    cost: {
        type: Number,
        trim: true,
        required: [true, 'Please give a cost']
    },
    currency: {
        type: String,
        default: 'USD'
    },
    sku: {
        type: String,
        trim: true,
        required: [true, 'Please give a SKU']
    },
    position: {
        type: Number,
    },
    manageInventory: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    barcode: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    weightUnit: {
        type: String,
        trim: true,
    },
    height: {
        type: Number,
        trim: true,
    },
    weight: {
        type: Number,
        trim: true,
    },
    depth: {
        type: Number,
        trim: true,
    },
    size: {
        type: String,
        trim: true,
    },
    dimensionUnit: {
        type: String,
        trim: true,
    },
    inventoryUnit: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    inventory: {
        type: Schema.Types.ObjectId,
        ref: 'Inventories'
    }
}, {
    timestamps: true
})

const ProductVariant = model('ProductVariants', ProductVariantSchema)
export default ProductVariant