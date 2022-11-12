import mongoose from "mongoose"
const { Schema, model } = mongoose

const ProductImageSchema = new Schema({
    name: { type: String },
    image: { type: String },
    order: { type: Number }
})
const ProductMetaSchema = new Schema({
    key: { type: String },
    value: { type: String }
})
const ProductSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: [true, 'Please give your name']
    },
    slug: {
        type: String,
        trim: true
    },
    body_html: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please give your title']
    },
    description: {
        type: String,
        trim: true
    },
    vendor: {
        type: String,
        trim: true
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Categories',
    }],
    tax: {
        type: Number,
        default: 0,
        required: [true, 'Please give gst value']
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    images: [ProductImageSchema],
    product_meta: [ProductMetaSchema],
    variants: [{
        type: Schema.Types.ObjectId,
        ref: "ProductVariants"
    }]
}, {
    timestamps: true
})
const Product = model('Products', ProductSchema)
export default Product