import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { FaToggleOn } from 'react-icons/fa';

const ClienteIndividual = ({ cliente }) => {
  const { _id } = cliente; // Obtén el _id del objeto cliente
  const { id } = useParams();
  const [isActivated, setIsActivated] = useState(false);
  const [estado, setEstado] = useState(cliente.estado);
  const [mostrarDetalles, setMostrarDetalles] = useState(false); // Estado para controlar la ventana emergente
  const [datanegociaciones, setDataNegociaciones] = useState([]);

  //Función para eliminar el cliente
  const navegar = useNavigate();

  const eliminarCliente = () => {
    if (tieneNegociacionesActivas()) {
      swal({
        title: "No se puede eliminar",
        text: "El cliente tiene negociaciones activas",
        icon: "warning",
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
      return;
    }

    swal({
      title: "Eliminar",
      text: "¿Estás seguro de eliminar el registro?",
      icon: "warning",
      buttons: {
        cancel: "NO",
        confirm: "SI"
      },
      dangerMode: true
    }).then(isConfirmed => {
      if (isConfirmed) {
        const url = `cliente/eliminarcliente/${_id}`
        // fetch(`http://localhost:4000/api/cliente/eliminarcliente/${_id}`, {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            swal({
              title: "Cliente eliminado con éxito",
              icon: "success"
            }).then(() => {
              navegar(0);
            });
          })
          .catch(error => {
            console.error('Error:', error);
            swal({
              title: "Error al eliminar el cliente",
              text: "Ha ocurrido un error al eliminar el cliente.",
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
          });
      }
    });
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/negociacion/obtenerNegociaciones')
      .then(res => res.json())
      .then(data => {
        setDataNegociaciones(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);


  // const tieneNegociacionesActivas = () => {
  //   return datanegociaciones.some(negociacion => negociacion.cliente === cliente.nombre && negociacion.estado === 'Activo');
  // };
  const tieneNegociacionesActivas = () => {
    return datanegociaciones.some(negociacion => negociacion.clienteId === cliente._id && negociacion.estado === 'Activo');
  };

  const toggleDetalles = () => {
    setMostrarDetalles(!mostrarDetalles);
  };

  const customStyles = {
    content: {
      width: '700px',
      height: '590px',
      margin: 'auto',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
    },
  };

  const closeModal = () => {
    setMostrarDetalles(false);
  };

  if (!cliente) {
    return <div>No se ha proporcionado un cliente válido</div>;
  }

  useEffect(() => {
    setIsActivated(estado === 'Activo');
  }, [estado]);

  const toggleActivation = () => {
    if (isActivated && tieneNegociacionesActivas()) {
      swal({
        title: "No se puede desactivar",
        text: "El cliente tiene negociaciones activas",
        icon: "warning",
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
      return;
    }

    setIsActivated(!isActivated);

    const newEstado = estado === 'Activo' ? 'Inactivo' : 'Activo';
    setEstado(newEstado);


    // Envía la solicitud al servidor para actualizar el estado en la base de datos
    const url = `cliente/actualizar-estado/${_id}`
    // fetch(`http://localhost:4000/api/cliente/actualizar-estado/${_id}`, {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: newEstado })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        swal({
          title: "Estado modificado correctamente",
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
        }).then(() => {
          window.location.reload();
        });
      }).catch(error => {
        console.error('Error:', error);
        swal({
          title: "Error",
          text: "Ha ocurrido un error al modificar el estado del cliente.",
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
      });
  };

  return (
    <tr>
      <td>{cliente.cedula}</td>
      <td>{cliente.nombre}</td>
      <td>{cliente.telefono}</td>
      <td>{cliente.email}</td>
      <td>{cliente.grupo}</td>
      <td style={{ textAlign: 'center' }}>
        <Link onClick={toggleDetalles} >
          <i className="fa fa-circle-info" title="Detalle" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
        </Link>

        {/* <Link to={`/admin/editarcliente/${cliente._id}`}>
          <i className="fa fa-pencil" title="Editar" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
        </Link> */}
        <Link to={`/admin/editarcliente/${cliente._id}`}>
          <i
            className="fa fa-pencil"
            title="Editar"
            style={{
              marginRight: 10,
              color: cliente.estado === 'Activo' ? '#212529' : 'gray',
              fontSize: 22,
              cursor: cliente.estado === 'Activo' ? 'pointer' : 'not-allowed',
            }}
            onClick={event => {
              if (cliente.estado !== 'Activo') {
                event.preventDefault();
                swal({
                  title: "Cliente inactivo",
                  text: "No se puede editar un cliente inactivo.",
                  icon: "warning",
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
            }}
          />
        </Link>
        <Link onClick={toggleActivation}>
          <FaToggleOn
            title="Activar-Desactivar"
            style={{
              marginRight: 10,
              color: isActivated ? 'green' : 'gray', // Cambia el color según el estado
              fontSize: 30,
              transition: 'transform 0.2s ease', // Agrega una transición suave al giro
              transform: isActivated ? 'rotateY(180deg)' : 'rotateY(0deg)', // Aplica el giro horizontal según el estado
            }}
          />
        </Link>
        <Link onClick={eliminarCliente}>
          <i className="fa fa-trash" title="Eliminar" style={{ color: '#dc3545', fontSize: 22 }} />
        </Link>
      </td>
      <Modal isOpen={mostrarDetalles} onRequestClose={toggleDetalles} style={customStyles} >
        <Link onClick={closeModal}>
          <FaTimes size={35} style={{ color: 'black', float: 'right' }} />
        </Link>
        <br />
        <h2 style={{ textAlign: 'center', color: '#032770' }}>DETALLE CLIENTE</h2>
        <br />
        <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
          <tbody>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Tipo documento</th>
              <td style={{ color: '#032770' }}>{cliente.tipoDocumento}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Documento</th>
              <td style={{ color: '#032770' }}>{cliente.cedula}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Nombre</th>
              <td style={{ color: '#032770' }}>{cliente.nombre}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Apellido</th>
              <td style={{ color: '#032770' }}>{cliente.apellido}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Dirección</th>
              <td style={{ color: '#032770' }}>{cliente.direccion}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Teléfono</th>
              <td style={{ color: '#032770' }}>{cliente.telefono}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Correo</th>
              <td style={{ color: '#032770' }}>{cliente.email}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Grupo</th>
              <td style={{ color: '#032770' }}>{cliente.grupo}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Tipo Documento Codeudor</th>
              <td style={{ color: '#032770' }}>{cliente.tipoDocumentoCod}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Documento Codeudor</th>
              <td style={{ color: '#032770' }}>{cliente.cedulaCodeudor}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Nombre Codeudor</th>
              <td style={{ color: '#032770' }}>{cliente.nombreCodeudor}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Apellido Codeudor</th>
              <td style={{ color: '#032770' }}>{cliente.apellidoCodeudor}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Teléfono Codeudor</th>
              <td style={{ color: '#032770' }}>{cliente.telefonoCodeudor}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>País</th>
              <td style={{ color: '#032770' }}>{cliente.pais}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </tr>
  );
};

export default ClienteIndividual;