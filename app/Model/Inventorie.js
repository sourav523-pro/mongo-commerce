import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    productId: {
        type: String,
        trim: true,
        required: [true, "Please give a product ID"]
    },
    variantId: {
        type: String,
        trim: true,
        required: [true, "Please give a variant ID"]
    },
    sku: {
        type: String,
        trim: true,
        required: [true, "Please give a SKU"]
    },
    starting: {
        type: String,
        default: 0
    },
    sales: {
        type: String,
        default: 0
    },
    purchase: {
        type: String,
        default: 0
    },
    prevStock: {
        type: String,
        default: 0
    },
    available: {
        type: String,
        default: 0
    },
    allocated: {
        type: String,
        default: 0
    },
    onhand: {
        type: String,
        default: 0
    },
    inventoryUnit: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
})

export default mongoose.model('Inventories', InventorySchema)