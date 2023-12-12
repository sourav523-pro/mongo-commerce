import mongoose from "mongoose"
const { Schema, model } = mongoose

const Address = new Schema({
    address: { type: String },
    address1: { type: String },
    zipcode: { type: String, min: 4, max: 10 },
    city: { type: String },
    state: { type: String },
    country: { type: String },
})

const UserSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: [true, 'Please give your name'],
        min: 2,
        max: 200
    },
    businessName: {
        type: String,
        trim: true,
        default: '',
        min: 2,
        max: 200
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please give your email'],
        unique: true,
        min: 5,
        max: 200
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Please give your phone']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please give your phone'],
        min: 8,
        max: 20
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: [true, 'Please give specific role']
    },
    address: [Address]
}, {
    timestamps: true
})
const User = model('Users', UserSchema)
export default User