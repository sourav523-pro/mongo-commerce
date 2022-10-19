import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: [true, 'Please give your name']
    },
    code: {
        type: String,
        trim: true
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
    category: {
        type: Array,
        default: []
    },
    gst: {
        type: Number,
        default: 0,
        required: [true, 'Please give gst value']
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    }
}, {
    timestamps: true
})

export default mongoose.model('Products', ProductSchema)