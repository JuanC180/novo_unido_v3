const express = require('express');
const { registrarProducto, obtenerProductos, obtenerDataProductos, actualizarProducto, eliminarProducto, actualizarEstadoProducto, obtenerImagen } = require('../controllers/ProductoControllers');
const router = express.Router();

//Agregar producto
router.post('/agregarProducto', registrarProducto)

// Obtener todos los Productos
router.get('/obtenerProducto', obtenerProductos);

// Obtener data de los productos
router.get('/obtenerdataproducto/:id', obtenerDataProductos);

//Actualizar Producto
router.put('/actualizarProducto/:id', actualizarProducto);

//Eliminar el producto
router.delete('/eliminarproducto/:id', eliminarProducto);

router.put('/actualizar-estado/:id', actualizarEstadoProducto);

router.get('/obtener-imagen-producto/:id', obtenerImagen);

module.exports = router;