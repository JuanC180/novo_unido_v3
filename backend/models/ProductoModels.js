const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId;

const schemaProducto = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    referencia: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    nombre: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    precioBase: {
        type: Number,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    imagen: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    path: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    estado: {
        type: String,
        default: 'Activo',
        trim: true
    },
})

const ModeloProducto = mongoose.model('Producto', schemaProducto)

module.exports = ModeloProducto
