const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId;

const schemaPlandePago = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    fechaPago: {
        type: Date,
        required: [true, 'Este campo es obligatorio'],
        trim: true,
    },
    valorPago: {
        type: Number,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    cumplioPago: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    }
})

const ModeloPlandePago = mongoose.model('PlandePago', schemaPlandePago)

module.exports = ModeloPlandePago
