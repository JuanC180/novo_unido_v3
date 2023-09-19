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

  const toggleDetalles = () => {
    setMostrarDetalles(!mostrarDetalles);
  };

  const customStyles = {
    content: {
      width: '700px',
      height: '500px',
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

  useEffect(() => {
    setIsActivated(estado === 'Activo');
  }, [estado]);

  const toggleActivation = () => {

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
          <i className="fa fa-circle-info"
            title="Este icono da acceso al formulario de edición del producto"
            style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
        </Link>
        {/* <Link to={`/admin/editarproducto/${producto._id}`}>
          <i className="fa fa-pencil" title="Editar" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
        </Link> */}
        <Link to={`/admin/editarproducto/${producto._id}`}>
          <i
            className="fa fa-pencil"
            title="Este icono da acceso al formulario de edición del producto"
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
          <i
            className="fa fa-toggle-on"
            title="Este icono permite cambiar el estado del producto a activo o inactivo"
            style={{
              marginRight: 10,
              color: isActivated ? 'green' : 'gray',
              fontSize: 30,
              transition: 'transform 0.2s ease',
              transform: isActivated ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
        <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px" }}>
          <tbody>
            <tr>
              <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Referencia</th>
              <td>{producto.referencia}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Nombre</th>
              <td>{producto.nombre}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Precio Base</th>
              <td>{producto.precioBase}</td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Descripción</th>
              <td>
                <div style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{producto.descripcion}</div>
              </td>
            </tr>
            <tr>
              <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Imagen</th>
              <td>
                <div style={{ textAlign: 'center' }}>
                  <img
                    style={{ display: 'block', margin: '0 auto' }}
                    width={200}
                    height={200}
                    src={`${import.meta.env.VITE_BACKEND_URL}/api/producto/obtener-imagen-producto/${producto._id}`}
                    alt="Descripción de la imagen"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </tr>
  );
};

export default ProductoIndividual;