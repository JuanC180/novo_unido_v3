const express = require('express')
const router = express.Router();

const { 
    registrar, 
    confirmar, 
    autenticar, 
    perfil, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
    obtenerUsuarios,
    eliminarUsuario,
    actualizarEstadoUsuario,
    editarUsuario,
    obtenerUsuario
} = require('../controllers/usuarioController.js');
const checkAuth = require('../middleware/authMiddleware.js');

router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
// area prvado
router.post("/", registrar);
router.get("/perfil", checkAuth, perfil)
router.put("/perfil/:id", checkAuth, actualizarPerfil)
router.put("/actualizar-password", checkAuth, actualizarPassword)
router.get("/obtener-usuarios", obtenerUsuarios)
router.delete("/eliminar-usuario/:id", eliminarUsuario)
router.put('/actualizar-estado/:id', actualizarEstadoUsuario);

router.put('/editar-usuario/:id', editarUsuario);
router.get('/obtener-usuario/:id', obtenerUsuario);

module.exports = router;