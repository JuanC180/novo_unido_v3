import React, { useState } from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import { Link, useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth'
import clienteAxios from '../config/axios'
import MenuLateral from '../components/MenuLateral'


const Registrar = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [nombreError, setNombreError] = useState(false);
  const [apellidoError, setApellidoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repetirPasswordError, setRepetirPasswordError] = useState(false);
  const [alerta, setAlerta] = useState({})


  const handleCancelar = () => {
    navigate(-1); // Regresa a la ubicación anterior
  };

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

  const handleSubmit = async e => {
    e.preventDefault()

    if ([email, nombre, apellido, password, repetirPassword].includes('')) {
      setAlerta({ msg: "Campos vacíos", error: true });
      return;
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

    setAlerta({})

    // crear el producto
    try {
      //   const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`
      const url = `/usuarios`
      const { data } = await clienteAxios.post(url, { email, nombre, apellido, password })
      console.log(data)
      setAlerta({
        msg: "Creado Correctamente",
        error: false
      })

      swal({
        title: `Creado Correctamente`,
        text: "",
        icon: "success",
        button: "Aceptar"
      });

      navigate("/admin/listar-usuarios")

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  const { msg } = alerta

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length >= 8) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleRepetirPasswordChange = (e) => {
    const newRepetirPassword = e.target.value;
    setRepetirPassword(newRepetirPassword);

    if (newRepetirPassword === password) {
      setRepetirPasswordError(false);
    } else {
      setRepetirPasswordError(true);
    }
  };

  const validateEmail = (email) => {
    // Expresión regular para validar el formato del correo
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const isValidEmail = validateEmail(newEmail);
    setEmailError(!isValidEmail);
  };

  return (
    <>
      <div className='control'>
        <Encabezado></Encabezado>

        <MenuLateral></MenuLateral>

        <main className="d-flex   flex-column border border-primary m-3 rounded" id="main">

          <h3 className="py-0 text-center px-4 pt-3 my-0">CREAR USUARIO</h3>
          <br />
          {msg && <Alerta alerta={alerta} />}

          <form className="formulario" onSubmit={handleSubmit} >

            <div className="contenedores d-flex justify-content-center flex-lg-row flex-column  flex-sm-column mx-5 gap-5">
              <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100 ">
                <div className="mb-3 w-100">
                  <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                  <input
                    type="text"
                    className={`form-control ${nombreError ? 'is-invalid' : ''}`}
                    id="nombre"
                    placeholder="Nombre"
                    required
                    maxLength={40}
                    onInput={(e) => validarTexto(e, setNombreError, 3)}
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                    }}
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
                    placeholder="Correo"
                    required
                    maxLength={60}
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && <div className="invalid-feedback">Ingrese un correo válido.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label htmlFor="descripcion" className="form-label fw-bold">Repetir contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${repetirPasswordError ? 'is-invalid' : ''}`}
                    id="descripcion"
                    placeholder="Repetir contraseña"
                    required
                    maxLength={25}
                    value={repetirPassword}
                    onChange={handleRepetirPasswordChange}
                  />
                  {repetirPasswordError && <div className="invalid-feedback">Las contraseñas no coinciden.</div>}
                </div>

                <div className="mb-3 w-100">

                </div>
              </div>

              <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0  w-100 ">
                <div className="mb-3 w-100">
                  <label htmlFor="apellido" className="form-label fw-bold">Apellido</label>
                  <input
                    type="text"
                    className={`form-control ${apellidoError ? 'is-invalid' : ''}`}
                    id="apellido"
                    placeholder="Apellido"
                    required
                    maxLength={40}
                    onInput={(e) => validarTexto(e, setApellidoError, 3)}
                    value={apellido}
                    onChange={(e) => {
                      setApellido(e.target.value);
                    }}
                  />
                  {apellidoError && <div className="invalid-feedback">El apellido debe tener al menos 3 caracteres.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Contraseña"
                    required
                    maxLength={25}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError && <div className="invalid-feedback">El password debe tener al menos 8 caracteres.</div>}

                </div>

                <div className="mb-3 w-100">

                </div>
              </div>
            </div>

            <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
              <div className="d-flex justify-content-center w-100">
                <div className="div_botones ms-sm-0 w-100 d-flex justify-content-center">
                  <button type="submit" className="btn btn-dark btn-styles">Guardar</button>
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

        <Pie></Pie>
      </div>
    </>
  )
}

export default Registrar