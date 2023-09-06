//Nombre del Proyecto, Modulo, Autor, Fecha, Version

// Documentar bloque de codigo

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';
import swal from 'sweetalert';

const CrearCliente = () => {
  const navigate = useNavigate();

  // Hooks  
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [grupo, setGrupo] = useState('');
  const [tipoDocumentoCod, setTipoDocumentoCod] = useState('');
  const [cedulaCodeudor, setCedulaCodeudor] = useState('');
  const [nombreCodeudor, setNombreCodeudor] = useState('');
  const [apellidoCodeudor, setApellidoCodeudor] = useState('');
  const [telefonoCodeudor, setTelefonoCodeudor] = useState('');
  const [pais, setPais] = useState('');
  const [nombreError, setNombreError] = useState(false);
  const [apellidoError, setApellidoError] = useState(false);
  const [direccionError, setDireccionError] = useState(false);
  const [grupoError, setGrupoError] = useState(false);
  const [nombreCodeudorError, setNombreCodeudorError] = useState(false);
  const [apellidoCodeudorError, setApellidoCodeudorError] = useState(false);
  const [cedulaError, setCedulaError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [cedulaCodeudorError, setCedulaCodeudorError] = useState(false);
  const [telefonoCodeudorError, setTelefonoCodeudorError] = useState(false);
  const { auth } = useAuth()

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
    setEmail(newEmail);

    const isValidEmail = validateEmail(newEmail);
    setEmailError(!isValidEmail);
  };

  const agregarCliente = async () => {

    // Verificar que todos los campos sean llenados
    if (
      tipoDocumento === '' ||
      cedula === '' ||
      nombre === '' ||
      apellido === '' ||
      direccion === '' ||
      telefono === '' ||
      email === '' ||
      tipoDocumentoCod === '' ||
      cedulaCodeudor === '' ||
      nombreCodeudor === '' ||
      apellidoCodeudor === '' ||
      telefonoCodeudor === '' ||
      pais === ''
    ) {
      swal({
        title: "Campos vacíos",
        text: "Todos los campos son obligatorios",
        icon: "warning",
        button: "Aceptar"
      });
      return;
    }

    if (
      nombreError ||
      apellidoError ||
      direccionError ||
      grupoError ||
      nombreCodeudorError ||
      apellidoCodeudorError ||
      cedulaError ||
      emailError ||
      telefonoError ||
      cedulaCodeudorError ||
      telefonoCodeudorError
    ) {
      swal({
        title: "Datos incorrectos",
        text: "Verifica los campos marcados en rojo",
        icon: "error",
        button: "Aceptar"
      });
      return;
    }

    const nuevoCliente = {
      tipoDocumento,
      cedula,
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      grupo,
      tipoDocumentoCod,
      cedulaCodeudor,
      nombreCodeudor,
      apellidoCodeudor,
      telefonoCodeudor,
      pais
    };

    try {
      const url = `cliente/agregarCliente`
      // const response = await fetch('http://localhost:4000/api/cliente/agregarCliente', {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
      });

      const data = await response.json();


      if (response.ok) {

        swal({
          title: "Cliente Creado Correctamente",
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
            window.location.href = "/admin/listaclientes";
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
          <h3 className="text-center py-0 pt-3 my-0">CREAR CLIENTE</h3>
          <br />
          <form className="formulario" action="">
            <div className="contenedores d-flex justify-content-center flex-lg-row flex-column flex-sm-column mx-5 gap-5">
              <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100">
                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Tipo documento</label>
                  <select className="form-select" required value={tipoDocumento}
                    onChange={(e) => { setTipoDocumento(e.target.value) }}>
                    <option value="">Seleccionar</option>
                    <option value="Cedula">Cédula</option>
                    <option value="Nit">Nit</option>
                  </select>
                </div>
                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Nombre</label>
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
                  <label className="form-label fw-bold">Dirección</label>
                  <input
                    type="text"
                    className={`form-control ${direccionError ? 'is-invalid' : ''}`}
                    id="direccion"
                    placeholder="Dirección"
                    required
                    maxLength={80}
                    onInput={(e) => setDireccionError(e.target.value.length < 6)}
                    value={direccion}
                    onChange={(e) => {
                      setDireccion(e.target.value);
                    }}
                  />
                  {direccionError && <div className="invalid-feedback">La dirección debe tener al menos 6 caracteres.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    maxLength={60}
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && <div className="invalid-feedback">Ingrese un correo válido.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Tipo documento Codeudor</label>
                  <select id="cliente" className="form-select" required value={tipoDocumentoCod}
                    onChange={(e) => { setTipoDocumentoCod(e.target.value) }}>
                    <option value="">Seleccionar</option>
                    <option value="Cedula">Cédula</option>
                    <option value="Nit">Nit</option>
                  </select>
                </div>
                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Nombre Codeudor</label>
                  <input
                    type="text"
                    className={`form-control ${nombreCodeudorError ? 'is-invalid' : ''}`}
                    id="nombreCodeudor"
                    placeholder="Nombre Codeudor"
                    required
                    maxLength={40}
                    onInput={(e) => validarTexto(e, setNombreCodeudorError, 3)}
                    value={nombreCodeudor}
                    onChange={(e) => {
                      setNombreCodeudor(e.target.value);
                    }}
                  />
                  {nombreCodeudorError && <div className="invalid-feedback">El nombre del codeudor debe tener al menos 3 caracteres.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Teléfono Codeudor</label>
                  <input
                    type="text"
                    className={`form-control ${telefonoCodeudorError ? 'is-invalid' : ''}`}
                    placeholder="Teléfono Codeudor"
                    required
                    maxLength={11}
                    onKeyDown={(e) => validarNumericos(e, setTelefonoCodeudorError, 7)}
                    value={telefonoCodeudor}
                    onChange={(e) => {
                      setTelefonoCodeudor(e.target.value);
                    }}
                  />
                  {telefonoCodeudorError && <div className="invalid-feedback">El teléfono del codeudor debe tener al menos 7 caracteres numéricos.</div>}
                </div>

              </div>
              <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Documento</label>
                  <input
                    type="text"
                    className={`form-control ${cedulaError ? 'is-invalid' : ''}`}
                    placeholder="Documento"
                    required
                    maxLength={11}
                    onKeyDown={(e) => validarNumericos(e, setCedulaError, 6)}
                    onChange={(e) => {
                      setCedula(e.target.value);
                    }}
                  />
                  {cedulaError && <div className="invalid-feedback">El documento debe tener al menos 6 caracteres numéricos.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Apellido</label>
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
                  <label className="form-label fw-bold">Teléfono</label>
                  <input
                    type="text"
                    className={`form-control ${telefonoError ? 'is-invalid' : ''}`}
                    placeholder="Teléfono"
                    required
                    maxLength={11}
                    onKeyDown={(e) => validarNumericos(e, setTelefonoError, 7)}
                    value={telefono}
                    onChange={(e) => {
                      setTelefono(e.target.value);
                    }}
                  />
                  {telefonoError && <div className="invalid-feedback">El teléfono debe tener al menos 7 caracteres numéricos.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Grupo</label>
                  <input
                    type="text"
                    className={`form-control ${grupoError ? 'is-invalid' : ''}`}
                    id="grupo"
                    placeholder="Grupo"
                    required
                    maxLength={30}
                    onInput={(e) => validarTexto(e, setGrupoError, 3)} 
                    value={grupo}
                    onChange={(e) => {
                      setGrupo(e.target.value);
                    }}
                  />
                  {grupoError && <div className="invalid-feedback">El grupo debe tener al menos 3 caracteres.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Documento Codeudor</label>
                  <input
                    type="text"
                    className={`form-control ${cedulaCodeudorError ? 'is-invalid' : ''}`}
                    placeholder="Documento Codeudor"
                    required
                    maxLength={11}
                    onKeyDown={(e) => validarNumericos(e, setCedulaCodeudorError, 6)}
                    value={cedulaCodeudor}
                    onChange={(e) => {
                      setCedulaCodeudor(e.target.value);
                    }}
                  />
                  {cedulaCodeudorError && <div className="invalid-feedback">El documento del codeudor debe tener al menos 6 caracteres numéricos.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">Apellido Codeudor</label>
                  <input
                    type="text"
                    className={`form-control ${apellidoCodeudorError ? 'is-invalid' : ''}`}
                    id="apellidoCodeudor"
                    placeholder="Apellido Codeudor"
                    required
                    maxLength={40}
                    onInput={(e) => validarTexto(e, setApellidoCodeudorError, 3)}
                    value={apellidoCodeudor}
                    onChange={(e) => {
                      setApellidoCodeudor(e.target.value);
                    }}
                  />
                  {apellidoCodeudorError && <div className="invalid-feedback">El apellido del codeudor debe tener al menos 3 caracteres.</div>}
                </div>

                <div className="mb-3 w-100">
                  <label className="form-label fw-bold">País</label>
                  <select className="form-select" required value={pais}
                    onChange={(e) => { setPais(e.target.value) }}>
                    <option value="">Seleccionar</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Panamá">Panamá</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
              <div className="d-flex justify-content-center w-100">
                <div className="div_botones ms-sm-0 w-100 d-flex justify-content-center">
                  <button type="button" className="btn btn-dark btn-styles" onClick={agregarCliente}>Guardar</button>
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

export default CrearCliente