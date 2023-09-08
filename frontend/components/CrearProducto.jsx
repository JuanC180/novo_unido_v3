import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral'

const CrearProducto = () => {
    const navigate = useNavigate();
    //Hooks
    const [referencia, setReferencia] = useState('')
    const [nombre, setNombre] = useState('')
    const [precioBase, setPrecioBase] = useState('')
    const [imagen, setImagen] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [referenciaError, setReferenciaError] = useState(false)
    const [nombreError, setNombreError] = useState(false)
    const [precioBaseError, setPrecioBaseError] = useState(false)
    const [descripcionError, setDescripcionError] = useState(false)
    const { auth } = useAuth()


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // console.log(selectedFile)
        setImagen(selectedFile);
    };

    const handleCancelar = () => {
        navigate(-1); // Regresa a la ubicación anterior
    };

    function validarNumericos(event, setErrorState, longitudMinima) {
        const charCode = event.keyCode || event.which;
        const char = String.fromCharCode(charCode);

        // Permitir la tecla de retroceso (backspace) y la tecla de suprimir (delete)
        if (charCode === 8 || charCode === 46 || charCode === 9) {
            return;
        }

        // Verificar si el carácter no es un número del 0 al 9
        if (/\D/.test(char)) {
            event.preventDefault();
            return;
        }

        const inputText = event.target.value;

        // Remover caracteres no numéricos, excepto el punto decimal
        const sanitizedText = inputText.replace(/[^\d.]/g, '');

        // Actualizar el valor del input con el texto sanitizado
        event.target.value = sanitizedText;

        // Validar longitud mínima
        if (sanitizedText.length < longitudMinima) {
            setErrorState(true);
        } else {
            setErrorState(false);
        }
    }

    const agregarProducto = async (e) => {
        e.preventDefault()
        // Verificar que todos los campos sean llenados
        if (
            referencia === '' ||
            nombre === '' ||
            precioBase === '' ||
            imagen === '' ||
            descripcion === ''
        ) {
            swal({
                title: "Campos vacíos",
                text: "Todos los campos son obligatorios",
                icon: "warning",
                button: "Aceptar"
            })
            return;
        }

        if (
            nombreError ||
            referenciaError ||
            precioBaseError ||
            descripcionError
        ) {
            swal({
                title: "Datos incorrectos",
                text: "Verifica los campos marcados en rojo",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }

        const nuevoProducto = {
            referencia,
            nombre,
            precioBase,
            imagen,
            descripcion
        };

        const formData = new FormData();
        formData.append('referencia', referencia);
        formData.append('nombre', nombre);
        formData.append('precioBase', precioBase);
        formData.append('imagen', imagen); // Agregar el archivo adjunto
        formData.append('descripcion', descripcion);
        formData.append('nuevoProducto', JSON.stringify(nuevoProducto))

        try {
            const url = `producto/agregarProducto`
            // const response = await fetch('http://localhost:4000/api/producto/agregarProducto', {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                swal({
                    title: "Producto creado correctamente",
                    icon: "success",
                    buttons: {
                        accept: {
                            text: "Aceptar",
                            value: true,
                            visible: true,
                            className: "btn-primary",
                            closeModal: true
                        }
                    }
                }).then((value) => {
                    if (value) {
                        window.location.href = "/admin/listaproductos";
                    }
                });
            } else {

                if (data.msg) {
                    throw new Error(data.msg);
                } else {
                    throw new Error(data.error);
                }
            }
        } catch (error) {
            console.error(error);
            swal({
                title: `${error.message}`,
                text: "",
                icon: "warning",
                button: "Aceptar"
            })
        }
    };

    return (
        <>
            <section className="d-flex">
                <MenuLateral></MenuLateral>


                <main className="d-flex flex-column  border border-primary m-3 rounded">
                    <h3 className="text-center py-0 pt-3 my-0">CREAR PRODUCTO</h3>
                    <br />
                    <form className="formulario" encType="multipart/form-data" onSubmit={agregarProducto}>
                        <div className="contenedores d-flex justify-content-center flex-lg-row flex-column flex-sm-column mx-5 gap-5">
                            <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100">
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Referencia</label>
                                    <input
                                        type="text"
                                        className={`form-control ${referenciaError ? 'is-invalid' : ''}`}
                                        placeholder="Referencia"
                                        required
                                        value={referencia}
                                        maxLength={6}
                                        onChange={(e) => {
                                            const inputText = e.target.value;
                                            const sanitizedText = inputText.replace(/[^a-zA-Z0-9ñÑ\s]/g, '');
                                            setReferencia(sanitizedText);

                                            // Usar una expresión regular para validar la referencia
                                            const referenciaRegex = /^[a-zA-Z]{2}\d{4}$/;
                                            if (referenciaRegex.test(sanitizedText)) {
                                                setReferenciaError(false);
                                            } else {
                                                setReferenciaError(true);
                                            }
                                        }}
                                    />
                                    {referenciaError && <div className="invalid-feedback">La referencia debe tener dos letras seguidas de cuatro números.</div>}
                                </div>

                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Precio base</label>
                                    <input type="text" className={`form-control ${precioBaseError || (precioBase && parseFloat(precioBase) < 33000000) ? 'is-invalid' : ''}`}
                                        placeholder="Precio base" required maxLength={9}
                                        onKeyDown={(e) => validarNumericos(e, setPrecioBaseError)}
                                        value={precioBase}
                                        onChange={(e) => {
                                            setPrecioBase(e.target.value);
                                        }}
                                    />
                                    {precioBase && parseFloat(precioBase) < 33000000 && <div className="invalid-feedback">El precio base debe ser mínimo $33000000</div>}
                                </div>

                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Descripción</label>
                                    <textarea
                                        className={`form-control ${descripcionError ? 'is-invalid' : ''}`}
                                        placeholder="Descripción"
                                        required
                                        maxLength={250}
                                        value={descripcion}
                                        onChange={(e) => {
                                            const inputText = e.target.value;
                                            const sanitizedText = inputText.replace(/[^a-zA-Z0-9ñÑ\s]/g, '');
                                            setDescripcion(sanitizedText);

                                            if (sanitizedText.length < 10) {
                                                setDescripcionError(true);
                                            } else {
                                                setDescripcionError(false);
                                            }
                                        }}
                                    />
                                    {descripcionError && <div className="invalid-feedback">La descripción debe tener al menos 10 caracteres.</div>}
                                </div>
                            </div>
                            <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${nombreError ? 'is-invalid' : ''}`}
                                        id="nombre"
                                        placeholder="Nombre"
                                        required
                                        maxLength={40}
                                        value={nombre}
                                        onChange={(e) => {
                                            const inputText = e.target.value;
                                            const sanitizedText = inputText.replace(/[^a-zA-Z0-9ñÑ\s]/g, '');
                                            setNombre(sanitizedText);

                                            if (sanitizedText.length < 3) {
                                                setNombreError(true);
                                            } else {
                                                setNombreError(false);
                                            }
                                        }}
                                    />
                                    {nombreError && <div className="invalid-feedback">El nombre debe tener al menos 3 caracteres.</div>}
                                </div>

                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Imagen</label>
                                    <input type="file" className="form-control" placeholder="Imagen" name='imagen' required onChange={handleFileChange} />
                                </div>
                            </div>

                        </div>
                        <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones ms-sm-0 w-100 d-flex justify-content-center">
                                    <button type="submit" className="btn btn-dark btn-styles" >Guardar</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones me-sm-0 w-100 d-flex justify-content-center">
                                    <button type="button" className="btn btn-dark btn-styles" onClick={handleCancelar}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </section>
        </>
    )
}

export default CrearProducto