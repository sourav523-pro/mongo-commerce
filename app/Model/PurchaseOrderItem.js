import mongoose from "mongoose"
const { Schema, model } = mongoose
const PurchaseOrderItemSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Orders",
        required: [true, 'Please give a order ID']
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: [true, 'Please give a product ID']
    },
    sku: {
        type: String,
        required: [true, 'Please give a sku']
    },
    quantity: {
        type: Number,
        required: [true, 'Please give a quantity']
    },
    price: {
        type: Number
    },
}, {
    timestamps: true
})

const PurchaseOrderItem = model('PurchaseOrderItems', PurchaseOrderItemSchema)
export default PurchaseOrderItem