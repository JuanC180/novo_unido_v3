const express = require('express');
const { registrarCliente, obtenerClientes, obtenerDataClientes, actualizarCliente, eliminarCliente, actualizarEstadoCliente } = require('../controllers/ClienteControllers');
const router = express.Router();

router.post('/agregarCliente', registrarCliente);

// Obtener todos los clientes
router.get('/obtenerCliente', obtenerClientes);

// Obtener data de los clientes
router.get('/obtenerdatacliente/:id', obtenerDataClientes);

// Actualizar Cliente
router.put('/actualizarCliente/:id', actualizarCliente);

// Eliminar el cliente
router.delete('/eliminarcliente/:id', eliminarCliente);

//Actualizar estado cliente
router.put('/actualizar-estado/:id', actualizarEstadoCliente);

module.exports = router;