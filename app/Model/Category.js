import mongoose from "mongoose"
const { Schema, model } = mongoose
const CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please give a name"]
    },
    slug: {
        type: String,
        trim: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: [true, "Please give a status"]
    },

}, {
    timestamps: true
})

const Category = model('Categories', CategorySchema)
export default Category