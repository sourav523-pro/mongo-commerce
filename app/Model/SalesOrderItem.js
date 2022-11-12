import mongoose from "mongoose"
const { Schema, model } = mongoose
const SalesOrderItemSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "SalesOrders",
        required: [true, 'Please give a order id']
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: [true, 'Please give a product id']
    },
    sku: {
        type: String,
        required: [true, 'Please give a sku']
    },
    quantity: {
        type: String
    },
    price: {
        type: String
    },
}, {
    timestamps: true
})

const SalesOrderItem = model('SalesOrderItems', SalesOrderItemSchema)

export default SalesOrderItem