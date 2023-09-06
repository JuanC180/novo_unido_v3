// const Cliente = require('../models/ClienteModels');

const Cliente = require('../models/ClienteModels')

const obtenerCliente = async (id) => {
    const cliente = await Cliente.findById(id)
    return cliente
}

module.exports = obtenerCliente