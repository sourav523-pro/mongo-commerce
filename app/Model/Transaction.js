import mongoose from "mongoose";

const TransactionsSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
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

export default mongoose.model('Transactions', TransactionsSchema)