import mongoose from "mongoose"
const { Schema, model } = mongoose

const UnitSchema = new Schema({
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

const Unit = model('Units', UnitSchema)

export default Unit