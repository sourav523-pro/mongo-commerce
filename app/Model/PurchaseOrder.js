import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: [true, 'Please give a user id']
    },
    vendorId: {
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

export default mongoose.model('PurchaseOrders', PurchaseOrderSchema)