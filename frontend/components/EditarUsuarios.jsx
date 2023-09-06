import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import MenuLateral from './MenuLateral'

const EditarUsuarios = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [nombreError, setNombreError] = useState(false);
  const [apellidoError, setApellidoError] = useState(false);
  const [emailError, setEmailError] = useState(false);

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

  useEffect(() => {
    const url = `usuarios/obtener-usuario/${id}`;
    // fetch(`http://localhost:4000/api/usuarios/obtener-usuario/${id}`)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener usuario');
        }
        return res.json();
      })
      .then((dataUsuario) => {
        console.log(dataUsuario[0])
        setNombre(dataUsuario.nombre)
        setApellido(dataUsuario.apellido)
        setEmail(dataUsuario.email)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);


  const actualizarUsuario = async (e) => {
    e.preventDefault()

    // const { nombre, apellido, email } = perfil;

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

    const usuarioActualizado = {
      nombre,
      apellido,
      email
    }

    try {
      const url = `usuarios/editar-usuario/${id}`;
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioActualizado)
      });

      if (response.ok) {
        swal({
          title: "Actualización exitosa",
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
            window.location.href = "/admin/listar-usuarios"
          }
        });

      }
      else {
        throw new Error('Error al actualizar usuario');
      }
    } catch (error) {
      console.log(error)
      swal({
        title: "Error",
        text: "Ha ocurrido un error al actualizar el usuario.",
        icon: "error",
        buttons: {
          accept: {
            text: "Aceptar",
            value: true,
            visible: true,
            className: "btn-danger",
            closeModal: true
          }
        }
      });
    }
  }


  return (
    // <div>EditarUsuarios</div>
    <>
      <section className="d-flex">
        <MenuLateral></MenuLateral>

        <main className="d-flex flex-column  border border-primary m-3 rounded">
          <h3 className="text-center py-0 pt-3 my-0">EDITAR USUARIO</h3>
          <br />
          <form className="formulario" onSubmit={actualizarUsuario}>
            <div className="contenedores d-flex justify-content-center flex-lg-row flex-column flex-sm-column mx-5 gap-5">
              <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100">
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
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    required
                    maxLength={60}
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && <div className="invalid-feedback">Ingrese un correo válido.</div>}
                </div>

              </div>
              <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
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

export default EditarUsuarios