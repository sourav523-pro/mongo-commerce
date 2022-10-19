import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    unit: {
        type: String,
        trim: true,
        required: [true, 'Please enter a unit.']
    },
    type: {
        type: String,
        trim: true,
        required: [true, 'Please enter type']
    }
}, {
    timestamps: true
})

export default mongoose.model('Units', UnitSchema)