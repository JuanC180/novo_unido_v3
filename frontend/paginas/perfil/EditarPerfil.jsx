import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Alerta from '../../components/Alerta'

const EditarPerfil = () => {
    const navigate = useNavigate();

    const { auth, actualizarPerfil } = useAuth()
    const [perfil, setPerfil] = useState({})
    const [alerta, setAlerta] = useState({})
    const [nombreError, setNombreError] = useState(false);
    const [apellidoError, setApellidoError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const handleCancelar = () => {
        navigate('/admin'); // Regresa a la ubicación anterior
    };

    useEffect(() => {
        setPerfil(auth)
    }, [auth])

    const handleSubmit = async e => {
        e.preventDefault()

        const { nombre, apellido, email } = perfil;

        if ([nombre, apellido, email].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        if (
            nombreError ||
            apellidoError ||
            emailError
        ) {
            swal({
                title: "Datos incorrectos",
                text: "Verifica los campos marcados en rojo",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }

        const resultado = await actualizarPerfil(perfil)
        setAlerta(resultado)
        window.location.href = '/admin/listar-usuarios';

    }

    const { msg } = alerta

    function validarTexto(event, setErrorState, longitudMinima) {
        const inputText = event.target.value;

        // Remover caracteres especiales y números, permitiendo solo letras y la letra "ñ" (tanto en mayúscula como en minúscula)
        const sanitizedText = inputText.replace(/[^a-zA-ZñÑ\s]/g, '');

        // Actualizar el valor del input con el texto sanitizado
        event.target.value = sanitizedText;

        // Validar longitud mínima
        if (sanitizedText.length < longitudMinima) {
            setErrorState(true);
        } else {
            setErrorState(false);
        }
    }

    const validateEmail = (email) => {
        // Expresión regular para validar el formato del correo
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setPerfil({
            ...perfil,
            email: newEmail  // Actualizar el email en el estado del perfil
        });

        const isValidEmail = validateEmail(newEmail);
        setEmailError(!isValidEmail);
    };


    return (
        <>
            {/* <div>EditarPerfil componente</div> */}

            <main className="d-flex   flex-column border border-primary m-3 rounded" id="main">

                <h3 className="py-0  px-4 pt-3 my-0">PERFIL</h3>
                <br />
                {msg && <Alerta alerta={alerta}></Alerta>}

                <form className="formulario"
                    onSubmit={handleSubmit}
                >

                    <div className="contenedores d-flex justify-content-center flex-lg-row flex-column  flex-sm-column mx-5 gap-5">
                        <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100 ">
                            <div className="mb-3 w-100">
                                <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                                <input
                                    type="text"
                                    className={`form-control ${nombreError ? 'is-invalid' : ''}`}
                                    id="nombre"
                                    aria-describedby="emailHelp"
                                    name='nombre'
                                    placeholder="Nombre"
                                    required
                                    maxLength={40}
                                    onInput={(e) => validarTexto(e, setNombreError, 3)}
                                    value={perfil.nombre || ''}
                                    onChange={e => setPerfil({
                                        ...perfil,
                                        [e.target.name]: e.target.value
                                    })}
                                />
                                {nombreError && <div className="invalid-feedback">El nombre debe tener al menos 3 caracteres.</div>}
                            </div>

                            <div className="mb-3 w-100">
                                <label htmlFor="email" className="form-label fw-bold">Correo</label>
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    id="email"
                                    aria-describedby="emailHelp"
                                    name='email'
                                    placeholder="Correo"
                                    required
                                    maxLength={60}
                                    value={perfil.email || ''}
                                    // onChange={e => setPerfil({
                                    //     ...perfil,
                                    //     [e.target.name]: e.target.value
                                    // })}
                                    onChange={handleEmailChange}

                                />
                                {emailError && <div className="invalid-feedback">Ingrese un correo válido.</div>}
                            </div>

                        </div>

                        <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0  w-100 ">
                            <div className="mb-3 w-100">
                                <label htmlFor="apellido" className="form-label fw-bold">Apellido</label>
                                <input
                                    type="text"
                                    className={`form-control ${apellidoError ? 'is-invalid' : ''}`}
                                    id="apellido"
                                    aria-describedby="emailHelp"
                                    name='apellido'
                                    placeholder="Apellido"
                                    required
                                    maxLength={40}
                                    onInput={(e) => validarTexto(e, setApellidoError, 3)}
                                    value={perfil.apellido || ''}
                                    onChange={e => setPerfil({
                                        ...perfil,
                                        [e.target.name]: e.target.value
                                    })}
                                />
                                {apellidoError && <div className="invalid-feedback">El apellido debe tener al menos 3 caracteres.</div>}
                            </div>
                        </div>
                    </div>


                    <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
                        <div className="d-flex justify-content-center w-100">
                            <div className="div_botones ms-sm-0 w-100 d-flex justify-content-center">
                                <button type="submit" className="btn btn-dark btn-styles btn-botones">Guardar</button>
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
        </>
    )
}

export default EditarPerfil