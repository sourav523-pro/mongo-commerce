import mongoose from "mongoose"
const { Schema, model } = mongoose

const UserSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: [true, 'Please give your name']
    },
    businessName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please give your email']
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Please give your phone']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please give your phone']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: [true, 'Please give specific role']
    },
    address: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})
const User = model('Users', UserSchema)
export default User