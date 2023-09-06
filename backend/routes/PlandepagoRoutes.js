const express = require('express');
const { registrarPlandePago, obtenerPlandePagos, obtenerDataPlandePagos, actualizarPlandePago, eliminarPlandepago } = require('../controllers/PlandepagoControllers');
const router = express.Router();

router.post('/agregarPlandePago', registrarPlandePago);

// Obtener todos los Plan de Pago
router.get('/obtenerPlandePago', obtenerPlandePagos);

// Obtener data de los PlandePago
router.get('/obtenerdataPlandePago/:id', obtenerDataPlandePagos);

// Actualizar PlandePago
router.put('/actualizarPlandePago/:id', actualizarPlandePago);

// Eliminar el PlandePago
router.delete('/eliminarPlandePago/:id', eliminarPlandepago);

module.exports = router;