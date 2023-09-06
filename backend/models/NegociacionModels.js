const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId;

const schemaNegociacion = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    fechaFacturacion: {
        type: Date,
        default: Date.now,
    },
    cliente: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    numFactura: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    tipoMaquina: {
        type: [String],
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    cantidad: {
        type: [Number],
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    precioBase: {
        type: [Number],
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    precioVenta: {
        type: [Number],
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    numCuotas: {
        type: Number,
        trim: true
    },
    tasa: {
        type: Number,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    anticipo: {
        type: Number,
        required: [true, 'Este campo es obligatorio'],
        trim: true,
    },
    interes: {
        type: Number,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    fechaGracia: {
        type: Date,
        required: [true, 'Este campo es obligatorio'],
        trim: true
    },
    total: {
        type: Number,
        trim: true
    },
    estado: {
        type: String,
        default: 'Activo',
        trim: true
    },

    clienteData:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },

    cumplimientoCuotas: {
        type: [Boolean],
        default: function () {
            return Array(this.numCuotas || 0).fill(false);
        },
    },
    estadoNegociacion: {
        type: String
    },
    detalleCuotas: {
        type: [
            {
                fecha: Date,
                valor: Number,
                estadoCuota: String,
            }
        ],
        default: [],  // Inicialmente vacío
    },
})

schemaNegociacion.pre("save", async function (next) {
    if (this.numCuotas && this.fechaGracia && this.total) {
        const valorCuota = this.total / this.numCuotas; // Calcula el valor de cada cuota

        const fechaFinGracia = new Date(this.fechaGracia);
        fechaFinGracia.setDate(fechaFinGracia.getDate() - 5); // 5 días antes de la fecha de gracia

        const fechasYValoresCuotas = [
            { fecha: fechaFinGracia, valor: valorCuota }
        ];

        for (let i = 1; i < this.numCuotas; i++) {
            const fechaAnterior = fechasYValoresCuotas[i - 1].fecha;
            const nuevaFecha = new Date(fechaAnterior);
            nuevaFecha.setDate(nuevaFecha.getDate() + 25); // Siguiente fecha cada 25 días
            fechasYValoresCuotas.push({ fecha: nuevaFecha, valor: valorCuota });
        }

        // Llena el array de cumplimiento con valores iniciales en `false`
        const cumplimientoCuotas = Array(this.numCuotas).fill(false);

        // Crea el array de fechas, valores y cumplimiento
        const fechasYValoresCumplimiento = fechasYValoresCuotas.map((item, index) => {
            return {
                fecha: item.fecha,
                valor: item.valor,
                cumplida: cumplimientoCuotas[index],
            };
        });

        this.detalleCuotas = fechasYValoresCumplimiento;
    }

    next();
});

schemaNegociacion.pre("save", function (next) {
    if (this.cumplimientoCuotas.includes(false)) {
        this.estadoNegociacion = "En mora";
    } else {
        this.estadoNegociacion = "En paz";
    }

    const currentDate = new Date();

    for (const cuota of this.detalleCuotas) {
        const fiveDaysBeforeDueDate = new Date(cuota.fecha - 5 * 24 * 60 * 60 * 1000);
    
        if (cuota.fecha < currentDate) {
            cuota.estadoCuota = "Vencida";
        } else if (currentDate <= cuota.fecha && currentDate > fiveDaysBeforeDueDate) {
            cuota.estadoCuota = "Próxima a vencerse";
        } else {
            cuota.estadoCuota = "Por pagar";
        }
    }

    next();
});

const ModeloNegociacion = mongoose.model('Negociacion', schemaNegociacion)

module.exports = ModeloNegociacion