import mongoose from "mongoose";

const SalesOrderItemSchema = new mongoose.Schema({
    orderId: {
        type: String,
        trim: true,
        required: [true, 'Please give a order id']
    },
    productId: {
        type: String,
        trim: true,
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

export default mongoose.model('SalesOrderItems', SalesOrderItemSchema)