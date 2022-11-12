import mongoose from "mongoose"
const { Schema, model } = mongoose

const AddressSchema = new Schema({
    address1: {
        type: String,
        trim: true
    },
    address2: {
        type: String,
    },
    aptNo: {
        type: String,
    },
    city: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
})

const BuyerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: [true, 'Please give a user id']
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Please give a name"]
    },
    companyName: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please give a email"]
    },
    phone: {
        type: String,
        trim: true,
        required: [true, "Please give a phone"]
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: [true, "Please give a status"]
    },
    address: {
        type: [AddressSchema],
        required: [true, "Please give buyer address"]
    }

}, {
    timestamps: true
})

const Buyer = model('Buyers', BuyerSchema)

export default Buyer