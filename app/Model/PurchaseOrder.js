import mongoose from "mongoose"
const { Schema, model } = mongoose
const PurchaseOrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: [true, 'Please give a user id']
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "Vendors",
        required: [true, 'Please give a vendor id']
    },
    orderNumber: {
        type: String,
        trim: true,
        required: [true, 'Please give a order number']
    },
    channel: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['on_hold', 'pending', 'processing', 'shipped', 'refunded', 'completed'],
        trim: true,
        required: [true, "Please give a status in ('on_hold', 'pending', 'processing', 'shipped', 'refunded', 'completed')"]
    },
    orderDate: {
        type: Date,
        trim: true,
        required: [true, "Please give a valid date"]
    },
    shippingDate: {
        type: Date
    },
    shippingMethod: {
        type: String
    },
    shippingTerms: {
        type: String
    },
    shippingName: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping name"]
    },
    shippingEmail: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping email"]
    },
    shippingPhone: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping phone"]
    },
    shippingAddress1: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping address"]
    },
    shippingAddress2: {
        type: String
    },
    shippingCity: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping city"]
    },
    shippingPostCode: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping post code"]
    },
    shippingCountry: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping country"]
    },
    shippingState: {
        type: String,
        trim: true,
        required: [true, "Please give a shipping state"]
    },
    invoiceNumber: {
        type: String,
        trim: true,
        required: [true, "Please give a invoice number"]
    },
    billingName: {
        type: String,
        trim: true,
        required: [true, "Please give a billing name"]
    },
    billingEmail: {
        type: String,
        trim: true,
        required: [true, "Please give a billing email"]
    },
    billingPhone: {
        type: String,
        trim: true,
        required: [true, "Please give a billing phone"]
    },
    billingAddress1: {
        type: String,
        trim: true,
        required: [true, "Please give a billing address"]
    },
    billingAddress2: {
        type: String
    },
    billingCity: {
        type: String,
        trim: true,
        required: [true, "Please give a billing city"]
    },
    billingPostCode: {
        type: String,
        trim: true,
        required: [true, "Please give a billing post code"]
    },
    billingCountry: {
        type: String,
        trim: true,
        required: [true, "Please give a billing country"]
    },
    billingState: {
        type: String,
        trim: true,
        required: [true, "Please give a billing state"]
    },
    notes: {
        type: String
    },
    subtotal: {
        type: Number
    },
    total: {
        type: Number
    },
    tax: {
        type: Number
    },
    discount: {
        type: Number
    },
    cgst: {
        type: Number
    },
    sgst: {
        type: Number
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, "Please give a payment method"]
    },
    paymentAmount: {
        type: Number,
        trim: true,
        required: [true, "Please give a payment amount"]
    },
    paymentDetails: {
        type: String,
    },
    orderItem: {
        type: Schema.Types.ObjectId,
        ref: "PurchaseOrderItems"
    }
}, {
    timestamps: true
})

const PurchaseOrder = model('PurchaseOrders', PurchaseOrderSchema)
export default PurchaseOrder