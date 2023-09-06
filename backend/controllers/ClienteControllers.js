const Cliente = require('../models/ClienteModels');


const registrarCliente = async (req, res) => {

    const { cedula } = req.body;

    const existeCedula = await Cliente.findOne({ cedula })


    if (existeCedula) {
        const error = new Error("Cedula ya registrada..")
        return res.status(400).json({ msg: error.message })
    }

    try {
        const nuevoCliente = new Cliente(req.body);


        await nuevoCliente.save();
        res.json({ message: 'Cliente agregado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al agregar el cliente' });
    }
};

const obtenerClientes = async (req, res) => {
    Cliente.find({})
        .then((results) => {
            res.json(results);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los clientes' });
        });
};

const obtenerDataClientes = async (req, res) => {
    const id = req.params.id;
    Cliente.findById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los datos del cliente' });
        });
};

const actualizarCliente = async (req, res) => {
    const id = req.params.id;
    const propiedadesActualizadas = req.body;
    try {
        await Cliente.findByIdAndUpdate(id, propiedadesActualizadas);
        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
};

const eliminarCliente = async (req, res) => {
    const id = req.params.id;
    try {
        await Cliente.findOneAndDelete({ _id: id });
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};

//Actualizar el estado del cliente
const actualizarEstadoCliente = (req, res) => {
    // Obtiene el ID del cliente desde los parámetros de la URL
    const clienteId = req.params.id;

    // Obtiene el nuevo estado del cliente desde el cuerpo de la solicitud
    const nuevoEstado = req.body.estado;

    // Actualiza el estado del cliente en la base de datos
    Cliente.findByIdAndUpdate(clienteId, { estado: nuevoEstado }, { new: true })
        .then(clienteActualizado => {
            // Envía la respuesta con el cliente actualizado
            res.json(clienteActualizado);
        })
        .catch(error => {
            // Maneja los errores y envía una respuesta con el código de error correspondiente
            res.status(500).json({ error: 'Error al actualizar el estado del cliente' });
        });
};

module.exports = {
    registrarCliente,
    obtenerClientes,
    obtenerDataClientes,
    actualizarCliente,
    eliminarCliente,
    actualizarEstadoCliente,
};