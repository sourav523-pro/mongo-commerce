import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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

export default mongoose.model('Users', UserSchema)