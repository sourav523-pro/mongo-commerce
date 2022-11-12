import mongoose from "mongoose"
const { Schema, model } = mongoose
const InventorySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: [true, "Please give a product ID"]
    },
    variantId: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariants",
        required: [true, "Please give a variant ID"]
    },
    sku: {
        type: String,
        trim: true,
        required: [true, "Please give a SKU"]
    },
    starting: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    purchase: {
        type: Number,
        default: 0
    },
    prevStock: {
        type: Number,
        default: 0
    },
    available: {
        type: Number,
        default: 0
    },
    allocated: {
        type: Number,
        default: 0
    },
    onhand: {
        type: Number,
        default: 0
    },
    inventoryUnit: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
})
const Inventory = model('Inventories', InventorySchema)
export default Inventory