const PlandePago = require('../models/PlandepagoModels');

const registrarPlandePago = async (req, res) => {
    try {
        const nuevoPlandePago = new PlandePago(req.body);
        console.log(req.body);
        console.log(nuevoPlandePago);
        await nuevoPlandePago.save();
        res.json({ message: 'Plan de Pago agregado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el Plan de Pago' });
    }
};

const obtenerPlandePagos = async (req, res) => {
    PlandePago.find({})
        .then((results) => {
            res.json(results);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los Planes de Pago' });
        });
};

const obtenerDataPlandePagos = async (req, res) => {
    const id = req.params.id;
    PlandePago.findById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los datos del Plan de Pago' });
        });
};

const actualizarPlandePago = async (req, res) => {
    const id = req.params.id;
    const propiedadesActualizadas = req.body;
    try {
      await PlandePago.findByIdAndUpdate(id, propiedadesActualizadas);
      res.json({ message: 'Plan de Pago actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el Plan de Pago' });
    }
  };

const eliminarPlandepago = async (req, res) => {
    const id = req.params.id;
    try {
        await PlandePago.findOneAndDelete({ _id: id });
        res.json({ message: 'Plan de Pago eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el Plan de Pago' });
    }
};

module.exports = {
    registrarPlandePago,
    obtenerPlandePagos,
    obtenerDataPlandePagos,
    actualizarPlandePago,
    eliminarPlandepago
};