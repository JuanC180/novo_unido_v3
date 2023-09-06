const Producto = require('../models/ProductoModels');
const path = require('path')
const fs = require('fs')
// const generarId = require('../helpers/generarId')

//const image = require('../public/uploads/products/no_imagen_available.png')

const { v4: uuidv4 } = require('uuid');


const registrarProducto = async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
        res.status(400).json({ msg: 'No hay archivos que subir' });
        return;
    }

    const { imagen } = req.files;
    const nombreCortado = imagen.name.split('.')
    const extension = nombreCortado[nombreCortado.length - 1]

    const extensionesValidas = ['png', 'jpg', 'jpeg'];
    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({ msg: `La extensión ${extension} no es permitida, extensiones válidas ${extensionesValidas}` })
    }

    const nombreFinal = uuidv4() + '.' + extension
    //const uploadPath = path.join(__dirname, '../../frontend/public/uploads/products/', nombreFinal);

    const uploadPath = path.join(__dirname, '../../backend/public/uploads/products/', nombreFinal);

    //console.log(uploadPath)

    imagen.mv(uploadPath, (err) => {
        if (err) {
            console.log(err)
            //   return res.status(500).json({err});
        }

        // res.json({msg: 'File uploaded to ' + uploadPath});
    });

    const { referencia } = req.body;
    const existeReferencia = await Producto.findOne({ referencia })

    if (existeReferencia) {
        const error = new Error("Referencia ya registrada.")
        return res.status(400).json({ msg: error.message })
    }

    try {
        const nuevoProducto = new Producto();
        nuevoProducto.referencia = req.body.referencia || nuevoProducto.referencia;
        nuevoProducto.nombre = req.body.nombre || nuevoProducto.nombre;
        nuevoProducto.imagen = nombreFinal || nuevoProducto.imagen;
        nuevoProducto.path = uploadPath || nuevoProducto.path;
        // nuevoProducto.imagen = imagen.name || nuevoProducto.imagen;
        nuevoProducto.cantidad = req.body.cantidad || nuevoProducto.cantidad;
        nuevoProducto.precioBase = req.body.precioBase || nuevoProducto.precioBase;
        nuevoProducto.descripcion = req.body.descripcion || nuevoProducto.descripcion;

        await nuevoProducto.save();
        res.json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

const obtenerProductos = async (req, res) => {
    Producto.find({})
        .then((results) => {
            res.json(results);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        });
};

const obtenerDataProductos = async (req, res) => {
    const id = req.params.id;
    Producto.findById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los datos del producto' });
        });
};

const eliminarImagenPrevia = () => {

}

const actualizarProducto = async (req, res) => {

    const id = req.params.id;
    const propiedadesActualizadas = req.body;
    //const { refencia, nombre, precioBase, descripcion } = req.body;

    const productoEditar = await Producto.findById(id)

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
        res.status(400).json({ msg: 'No hay archivos que subir' });
        return;
    }

    //limpiar imagen previa
    try {
        if (productoEditar.imagen) {
            const pathImagenBorrar = path.join(__dirname, '../../backend/public/uploads/products/', productoEditar.imagen);
            if (fs.existsSync(pathImagenBorrar)) {
                fs.unlinkSync(pathImagenBorrar)
            }
        }
    } catch (error) {
        console.log(error)
    }

    const { imagen } = req.files;
    const nombreCortado = imagen.name.split('.')
    const extension = nombreCortado[nombreCortado.length - 1]

    const extensionesValidas = ['png', 'jpg', 'jpeg'];
    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({ msg: `La extensión ${extension} no es permitida, extensiones válidas ${extensionesValidas}` })
    }

    const nombreFinal = uuidv4() + '.' + extension
    //const uploadPath = path.join(__dirname, '../../frontend/public/uploads/products/', nombreFinal);
    const uploadPath = path.join(__dirname, '../../backend/public/uploads/products/', nombreFinal);


    imagen.mv(uploadPath, (err) => {
        if (err) {
            console.log(err)
            //   return res.status(500).json({err});
        }

        // res.json({msg: 'File uploaded to ' + uploadPath});
    });


    // const { referencia } = req.body;
    //const existeReferencia = await Producto.findOne({ referencia })

    // if (existeReferencia) {
    //     const error = new Error("Referencia ya registrada.")
    //      return res.status(400).json({ msg: error.message })
    // }










    //console.log("ESTE ES BODY: ", propiedadesActualizadas)
    //console.log("MioIma: ", req.files)

    // const objPropiedaesActulizadas = JSON.parse(propiedadesActualizadas.productoActualizado)
    //console.log("PARSEADO: ", objPropiedaesActulizadas)
    // objPropiedaesActulizadas.imagen = req.files.imagen
    //console.log("ACTUALIZADO: ", objPropiedaesActulizadas)
    try {
        //const nuevoProducto = new Producto();
        productoEditar.referencia = req.body.referencia || productoEditar.referencia;
        productoEditar.nombre = req.body.nombre || productoEditar.nombre;
        productoEditar.imagen = nombreFinal || productoEditar.imagen;
        productoEditar.path = uploadPath || productoEditar.path;
        // nuevoProducto.imagen = imagen.name || nuevoProducto.imagen;
        productoEditar.cantidad = req.body.cantidad || productoEditar.cantidad;
        productoEditar.precioBase = req.body.precioBase || productoEditar.precioBase;
        productoEditar.descripcion = req.body.descripcion || productoEditar.descripcion;

        await productoEditar.save();

        //await Producto.findByIdAndUpdate(id, objPropiedaesActulizadas);
        res.json({ message: 'Producto actualizado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const eliminarProducto = async (req, res) => {
    const id = req.params.id;
    try {
        await Producto.findOneAndDelete({ _id: id });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

//Actualizar el estado del producto
const actualizarEstadoProducto = (req, res) => {
    // Obtiene el ID del producto desde los parámetros de la URL
    const productoId = req.params.id;

    // Obtiene el nuevo estado del producto desde el cuerpo de la solicitud
    const nuevoEstado = req.body.estado;

    // Actualiza el estado del producto en la base de datos
    Producto.findByIdAndUpdate(productoId, { estado: nuevoEstado }, { new: true })
        .then(productoActualizado => {
            // Envía la respuesta con el producto actualizado
            res.json(productoActualizado);
        })
        .catch(error => {
            // Maneja los errores y envía una respuesta con el código de error correspondiente
            res.status(500).json({ error: 'Error al actualizar el estado del producto' });
        });
};

const obtenerImagen = (req, res) => {
    const id = req.params.id;

    Producto.findById(id)
        .then((result) => {

            if (result.imagen) {

                const pathImagen = path.join(__dirname, '../public/uploads/products', result.imagen)

                if (fs.existsSync(pathImagen)) {
                    return res.sendFile(pathImagen)
                }
            }

            const pathImagen = path.join(__dirname, '../public/uploads/products/no_image_available.png')
            res.sendFile(pathImagen)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los datos del producto' });
        });
}

module.exports = {
    registrarProducto,
    obtenerProductos,
    obtenerDataProductos,
    actualizarProducto,
    eliminarProducto,
    actualizarEstadoProducto,
    obtenerImagen
}