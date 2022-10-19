import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
    productId: {
        type: String,
        trim: true,
        required: [true, 'Please give product ID.']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please give your title']
    },
    price: {
        type: String,
        trim: true,
        required: [true, 'Please give a price']
    },
    cost: {
        type: String,
        trim: true,
        required: [true, 'Please give a cost']
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
        type: String,
    },
    weightUnit: {
        type: String,
        trim: true,
    },
    height: {
        type: String,
        trim: true,
    },
    weight: {
        type: String,
        trim: true,
    },
    depth: {
        type: String,
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
    }
}, {
    timestamps: true
})

export default mongoose.model('ProductVariants', ProductVariantSchema)