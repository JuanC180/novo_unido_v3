const express = require('express');
const { registrarNegociacion, obtenerNegociaciones, obtenerDataNegociaciones, actualizarNegociacion, eliminarNegociacion, actualizarEstadoNegociacion, actualizarCuota, enviarAlertaEmail } = require('../controllers/NegociacionControllers');
const router = express.Router();

//Agregar negociación
router.post('/agregarNegociacion', registrarNegociacion)

// Obtener todas las negociaciones
router.get('/obtenerNegociaciones', obtenerNegociaciones);

// Obtener data de las negociaciones
router.get('/obtenerdatanegociacion/:id', obtenerDataNegociaciones);

//Actualizar negociación
router.put('/actualizarNegociacion/:id', actualizarNegociacion);

//Eliminar negociación
router.delete('/eliminarnegociacion/:id', eliminarNegociacion);

//Actualizar estado negociación
router.put('/actualizar-estado/:id', actualizarEstadoNegociacion);

router.put('/actualizar-cuota/:idNegociacion/:numCuota', actualizarCuota);

router.post('/enviar-alerta-email', enviarAlertaEmail)

module.exports = router;