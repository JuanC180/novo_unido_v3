const Usuario = require('../models/usuarioModel.js');
const generarId = require('../helpers/generarId.js');
const generarJWT = require('../helpers/generarJWT.js')
const emailRegistro = require('../helpers/emailRegistro.js')
const emailOlvidePassword = require('../helpers/emailOlvidePassword.js')

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        res.json( usuarios )
    } catch (err) {
        console.log(err)
    }
} 

const registrar = async (req, res) =>{

    const {estado,nombre,apellido} = req.body
    let {email} = req.body;
    email = email.toLowerCase()

    

    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado.")
        return res.status(400).json({msg: error.message})
    }

    try {
        // guradar nuevo Usuario
        const usuario = new Usuario(req.body);
        usuario.email = req.body.email.toLowerCase() || usuario.email.toLowerCase();

        const usuarioGuardado = await usuario.save();

        emailRegistro({
            email,
            nombre,
            apellido,
            estado,
            token: usuarioGuardado.token
        })

        res.json(usuarioGuardado)
        // res.json({msg: "Registrano Usuario...."})

    } catch (error) {
        console.log(error)
    }
}

const perfil = (req, res) => {
    const { usuario } = req;
    // console.log(req.usuario)
    res.json(usuario )
}

const confirmar = async (req, res) =>{
    const {token} = req.params
    const usuarioConfirmar = await Usuario.findOne({token})

    // console.log(usuarioConfirmar)
    
    if(!usuarioConfirmar){
        const error = new Error("Token no válido")
        return res.status(404).json({msg:error.message})
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()

        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) =>{
    const {password} = req.body
    let {email} =  req.body
    email = email.toLowerCase()

    const usuario = await Usuario.findOne({email})
 
    if(!usuario){
     const error = new Error("El usuario no existe");
     return res.status(404).json({msg: error.message});
    }
 
    // comprobar si un usaurio esta comprobado
    if(!usuario.confirmado){
     const error = new Error("Tu cuenta no ha sido confirmada");
     return res.status(403).json({msg: error.message});
    }

    
    usuario.email = usuario.email.toLowerCase()
 
    // revisar el password
    if( await usuario.comprobarPassword(password)){

        let estadoActivo = ''

        if(usuario !== null && usuario.estado !== null && usuario.estado !== undefined){
            estadoActivo = usuario.estado;
        }

        if(estadoActivo !== 'Activo'){
            const error = new Error("Usuario inactivo");
            return res.status(403).json({msg: error.message});
        }

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            estado: usuario.estado, // cambiar por nombre
            email: usuario.email,
            token: generarJWT(usuario.id)
        })

     

    }else{
     const error = new Error("La contraseña o correo son incorrectos");
     return res.status(403).json({msg: error.message});
    }
 }

 const olvidePassword = async (req, res)=>{
    let { email } = req.body;
    email = email.toLowerCase()


    const existeUsuario = await Usuario.findOne({email})

    if(!existeUsuario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message})
    }

    try {
        existeUsuario.token = generarId();
        existeUsuario.email = req.body.email.toLowerCase() || existeUsuario.email.toLowerCase();
        await existeUsuario.save()

        //enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeUsuario.nombre,
            apellido: existeUsuario.apellido,
            token: existeUsuario.token

        })

        res.json({msg: "Hemos enviado un correo con las instrucciones"})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res)=>{
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({token})

    if(tokenValido){
        // el token es valido el usuario existe
        res.json({msg: "Token válido y el usuario existe"})
    }else{
        const error = new Error("Token no válido")
        return res.status(400).json({msg: error.message})
    }

}

const nuevoPassword = async (req, res)=>{
    const { token }    = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({token})
    
    if(!usuario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }

    try {
        usuario.token = null;
        usuario.password = password;
        await usuario.save();
        res.json({msg: "Contraseña modificado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id)

    if(!usuario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    let { email } = req.body
    email = email.toLowerCase()

    if(usuario.email.toLowerCase() !== req.body.email.toLowerCase()){
        const existeEmail = await Usuario.findOne({email})
        if(existeEmail){
            const error = new Error('Correo ya esta en uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        usuario.nombre = req.body.nombre || usuario.nombre;
        usuario.apellido = req.body.apellido || usuario.apellido;
        usuario.email = req.body.email.toLowerCase() || usuario.email.toLowerCase();

        const usuarioActualizado = await usuario.save()
        res.json(usuarioActualizado)
    } catch (error) {
        console.log(error)
    }

}

const actualizarPassword = async (req, res) => {
    // leer datos 
    const { id } = req.usuario;
    const { passwordActual, passwordNuevo } = req.body;
    // comprobar usuario existe
    const usuario = await Usuario.findById(id)
    if(!usuario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message});
    }
    // comprobar password
    if(await usuario.comprobarPassword(passwordActual)){
        usuario.password = passwordNuevo
        await usuario.save()
        res.json({msg: 'Contraseña almacenada correctamente'})
    }else{
        const error = new Error("La contraseña actual es incorrecta")
        return res.status(400).json({msg: error.message});
    }
    //almacenar el nuevos pwd


}

const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findById(id)

    if(!usuario){
        return res.status(404).json({ msg: "No encontrado", id})
    }

    if(id.toString() !== usuario._id.toString()){
        return res.json({ msg: "Accion no válida" })
    }

    try {
        await usuario.deleteOne()
    } catch (error) {
        console.log(error)
    }
}

//Actualizar el estado del usuario
const actualizarEstadoUsuario = (req, res) => {
    // Obtiene el ID del usuario desde los parámetros de la URL
    const usuarioId = req.params.id;

    // Obtiene el nuevo estado del usuario desde el cuerpo de la solicitud
    const nuevoEstado = req.body.estado;

    // Actualiza el estado del usuario en la base de datos
    Usuario.findByIdAndUpdate(usuarioId, { estado: nuevoEstado }, { new: true })
        .then(usuarioActualizado => {
            // Envía la respuesta con el usuario actualizado
            res.json(usuarioActualizado);
        })
        .catch(error => {
            // Maneja los errores y envía una respuesta con el código de error correspondiente
            res.status(500).json({ error: 'Error al actualizar el estado del usuario' });
        });
};

const editarUsuario = async (req, res) => {

    const id = req.params.id;
    const usuario =  await Usuario.findById(id)

    const { nombre,apellido } = req.body
    let { email } = req.body
    email = email.toLowerCase()

    const emailAnterior = usuario.email.toLowerCase();
    const emailNuevo = email;
    // si token==null y confirmado== true
    // ENVIA CORREO



    if(!usuario){
        return res.status(404).json({ msg: "No Encontrado", id})
    }

    if(id.toString() !== usuario._id.toString()){
        return res.json({ msg: "Accion no válida" })
    }



    try {
        usuario.nombre = req.body.nombre || usuario.nombre;
        usuario.apellido = req.body.apellido || usuario.apellido;
        usuario.email = req.body.email.toLowerCase() || usuario.email.toLowerCase();

        if(emailNuevo !== emailAnterior){

            emailRegistro({
                email,
                nombre,
                apellido,
                token: usuario.token
            })
        }

        await usuario.save()
        res.json({msg: "Usuario editado Correctamente."})

    } catch (error) {
        console.log(error)
    }


}

const obtenerUsuario = async (req, res) =>{
    const { id } = req.params
    Usuario.findById(id)
        .then((results) => {
            res.json(results);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        });

} 


module.exports = {
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
}