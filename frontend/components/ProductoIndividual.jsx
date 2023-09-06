import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { FaToggleOn } from 'react-icons/fa';

const ProductoIndividual = ({ producto }) => {
  const { _id } = producto; // Obtener el _id del objeto cliente
  const { id } = useParams();
  const [isActivated, setIsActivated] = useState(false);
  const [estado, setEstado] = useState(producto.estado);
  const [mostrarDetalles, setMostrarDetalles] = useState(false); // Estado para controlar la ventana emergente
  const [datanegociaciones, setDataNegociaciones] = useState([]);

  const toggleDetalles = () => {
    setMostrarDetalles(!mostrarDetalles);
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

  if (!producto) {
    return <div>No se ha proporcionado un producto válido</div>;
  }

  const tieneNegociacionesActivas = () => {
    return datanegociaciones.some((negociacion) => {
      return negociacion.estado === 'Activo' && negociacion.tipoMaquina.includes(producto.nombre);
    });
  };

  useEffect(() => {
    setIsActivated(estado === 'Activo');
  }, [estado]);

  const toggleActivation = () => {
    if (isActivated && tieneNegociacionesActivas()) {
      swal({
        title: "No se puede desactivar",
        text: "El producto tiene negociaciones activas",
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
    const url = `producto/actualizar-estado/${_id}`;
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
      })
      .catch(error => {
        console.error('Error:', error);
        swal({
          title: "Error",
          text: "Ha ocurrido un error al modificar el estado del producto.",
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
    <tr >
      <td>{producto.referencia}</td>
      <td>{producto.nombre}</td>
      <td>$ {parseFloat(producto.precioBase).toLocaleString('es-CO')}</td>
      <td style={{ textAlign: 'center' }}>
        <Link onClick={toggleDetalles} >
          <i className="fa fa-circle-info" title="Detalle" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
        </Link>
        {/* <Link to={`/admin/editarproducto/${producto._id}`}>
          <i className="fa fa-pencil" title="Editar" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
        </Link> */}
        <Link to={`/admin/editarproducto/${producto._id}`}>
          <i
            className="fa fa-pencil"
            title="Editar"
            style={{
              marginRight: 10,
              color: producto.estado === 'Activo' ? '#212529' : 'gray',
              fontSize: 22,
              cursor: producto.estado === 'Activo' ? 'pointer' : 'not-allowed',
            }}
            onClick={event => {
              if (producto.estado !== 'Activo') {
                event.preventDefault();
                swal({
                  title: "Producto inactivo",
                  text: "No se puede editar un producto inactivo.",
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
              // color: isActivated ? '#021F59' : 'gray', // Cambia el color según el estado
              color: isActivated ? 'green' : 'gray', // Cambia el color según el estado
              fontSize: 30,
              transition: 'transform 0.2s ease', // Agrega una transición suave al giro
              transform: isActivated ? 'rotateY(180deg)' : 'rotateY(0deg)', // Aplica el giro horizontal según el estado
            }}
          />
        </Link>
      </td>
      <Modal isOpen={mostrarDetalles} onRequestClose={toggleDetalles} style={customStyles} >
        <Link onClick={closeModal}>
          <FaTimes size={35} style={{ color: 'black', float: 'right' }} />
        </Link>
        <br />
        <h2 style={{ textAlign: 'center', color: '#032770' }}>DETALLE PRODUCTO</h2>
        <br />
        <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
          <tbody>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Referencia</th>
              <td style={{ color: '#032770' }}>{producto.referencia}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Nombre</th>
              <td style={{ color: '#032770' }}>{producto.nombre}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Precio Base</th>
              <td style={{ color: '#032770' }}>{producto.precioBase}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Descripción</th>
              <td style={{ color: '#032770' }}>
                <div style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{producto.descripcion}</div>
              </td>
            </tr>
            <p><img className='text-centerounded mx-auto d-block' width={200} height={200} src={`${import.meta.env.VITE_BACKEND_URL}/api/producto/obtener-imagen-producto/${producto._id}`} ></img></p>
          </tbody>
        </table>
      </Modal>
    </tr>
  );
};

export default ProductoIndividual;