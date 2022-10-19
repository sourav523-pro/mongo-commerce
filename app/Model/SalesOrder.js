import mongoose from "mongoose";

const SalesOrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: [true, 'Please give a user id']
    },
    buyerId: {
        type: String,
        trim: true,
        required: [true, 'Please give a vendor id']
    },
    orderNumber: {
        type: String,
        required: [true, 'Please give a order number']
    }
}, {
    timestamps: true
})

export default mongoose.model('SalesOrders', SalesOrderSchema)