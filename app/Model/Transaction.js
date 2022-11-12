import mongoose from "mongoose"
const { Schema, model } = mongoose

const TransactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: [true, 'Please give a user id']
    },
    amount: {
        type: Number,
        trim: true,
        min: 1,
        required: [true, 'Please give a amount']
    },
    type: {
        type: String,
        enum: ['expense', 'income', 'debt', 'lend'],
        default: 'expense',
        required: [true, 'Please select a transaction type']
    },
    note: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
})

const Transaction = model('Transactions', TransactionSchema)
export default Transaction