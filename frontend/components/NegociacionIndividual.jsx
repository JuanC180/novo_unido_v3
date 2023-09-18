import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FaToggleOn } from 'react-icons/fa';
import { parseISO, format } from 'date-fns';
import isValid from 'date-fns/isValid';
import Modal from 'react-modal';

import useNegociacion from '../hooks/useNegociacion'

const NegociacionIndividual = ({ negociacion }) => {
  const { _id } = negociacion;
  const { id } = useParams();
  // const { auth } = useAuth()
  const { negociaciones } = useNegociacion()

  const [isActivated, setIsActivated] = useState(false);
  const [estado, setEstado] = useState(negociacion.estado);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPlanPagoModal, setShowPlanPagoModal] = useState(false);
  const [cuotasPagadas, setCuotasPagadas] = useState({});

  useEffect(() => {
    const url = `cliente/obtenerCliente`;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        setDataClientes(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Función para marcar una cuota como pagada
  const handleCuotaPagada = (numCuota) => {
    setCuotasPagadas((prevCuotas) => ({
      ...prevCuotas,
      [numCuota]: true,
    }));

    // Envía la solicitud al servidor para actualizar el estado de la cuota en la base de datos
    const url = `negociacion/actualizar-cuota/${_id}/${numCuota}`;
    // fetch(`http://localhost:4000/api/negociacion/actualizar-cuota/${_id}/${numCuota}`, {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numCuota: numCuota, pagada: true })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
        swal({
          title: "Error",
          text: "Ha ocurrido un error al marcar la cuota como pagada.",
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

  // Función para marcar una cuota como NO pagada
  const handleCuotaNoPagada = (numCuota) => {
    setCuotasPagadas((prevCuotas) => ({
      ...prevCuotas,
      [numCuota]: false,

    }));

    // Envía la solicitud al servidor para actualizar el estado de la cuota en la base de datos
    const url = `negociacion/actualizar-cuota/${_id}/${numCuota}`
    // fetch(`http://localhost:4000/api/negociacion/actualizar-cuota/${_id}/${numCuota}`, {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numCuota, pagada: false })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
        swal({
          title: "Error",
          text: "Ha ocurrido un error al marcar la cuota como no pagada.",
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

  useEffect(() => {
    // Obtén la lista de cuotas pagadas desde la negociación recibida
    const cuotasPagadasDesdeNegociacion = negociacion.cumplimientoCuotas
      ? negociacion.cumplimientoCuotas.reduce((cuotas, pagada, index) => {
        if (pagada) {
          cuotas[index + 1] = true;
        }
        return cuotas;
      }, {})
      : {};

    // Establece el estado cuotasPagadas con la lista de cuotas pagadas
    setCuotasPagadas(cuotasPagadasDesdeNegociacion);
  }, [negociacion]);

  // Función para calcular los subtotales en cada posición del array cantidad y precioVenta
  const calcularSubtotales = () => {
    const cantidad = negociacion.cantidad;
    const precioVenta = negociacion.precioVenta;
    const subtotales = [];

    for (let i = 0; i < cantidad.length; i++) {
      const subtotal = cantidad[i] * precioVenta[i];
      subtotales.push(subtotal);
    }

    return subtotales;
  };

  const subtotales = calcularSubtotales();
  const sumaSubtotales = subtotales.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  let lastExecutionTime = 0;
  const notificarPorEmail = (iteracion) => {


    const now = Date.now();

    if (now - lastExecutionTime > 50000) { // only execute once every 5 seconds
      lastExecutionTime = now;

      const objetoInfo = { negociacion, iteracion }
      const encodedInfo = encodeURIComponent(JSON.stringify(objetoInfo));

      // mando datos al server
      const url = `negociacion/enviar-alerta-email`
      // fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}?info=${encodedInfo}`
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`
        ,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ negociacion, iteracion })
        }
      )
        .then(res => res.json())
        .then(data => {
          console.log(data, "Soy data");
        })
        .catch(error => {
          console.log(error)
        })

    }

  }

  // let lastNotificationDate = null;

  // const notificarPorEmail = (iteracion) => {
  //   const today = new Date();
  //   const todayDateString = today.toDateString();

  //   if (lastNotificationDate !== todayDateString) {
  //     lastNotificationDate = todayDateString;
  //     enviarNotificacionPorEmail(iteracion);
  //   }
  // };

  const enviarNotificacionPorEmail = (iteracion) => {
    const objetoInfo = { negociacion, iteracion };
    const encodedInfo = encodeURIComponent(JSON.stringify(objetoInfo));

    const url = `negociacion/enviar-alerta-email`;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ negociacion, iteracion }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Soy data");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const toggleDetalles = () => {
    setMostrarDetalles(!mostrarDetalles);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setMostrarDetalles(false);
    setShowModal(false);
  };

  const togglePlanPagoModal = () => {
    setShowPlanPagoModal(!showPlanPagoModal);
  };

  const closeModalPlanPago = () => {
    setShowPlanPagoModal(false);
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
    },
  };

  const customStyles2 = {
    content: {
      width: '700px',
      height: '500px',
      margin: 'auto',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  if (!negociacion) {
    return <div>No se ha proporcionado una negociación válida</div>;
  }

  useEffect(() => {
    setIsActivated(estado === 'Activo');
  }, [estado]);

  const toggleActivation = () => {
    setIsActivated(!isActivated);

    const newEstado = estado === 'Activo' ? 'Inactivo' : 'Activo';
    setEstado(newEstado);

    // Envía la solicitud al servidor para actualizar el estado en la base de datos
    const url = `negociacion/actualizar-estado/${_id}`
    // fetch(`http://localhost:4000/api/negociacion/actualizar-estado/${_id}`, {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: newEstado })
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
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
          text: "Ha ocurrido un error al modificar el estado de la negociación.",
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

  // Fecha creación
  let fechaCreacionFormateada = '';
  const parsedFechaCreacion = parseISO(negociacion.fechaFacturacion);
  if (isValid(parsedFechaCreacion)) {
    const fechaFacturacion = new Date(parsedFechaCreacion.getTime() + parsedFechaCreacion.getTimezoneOffset() * 60000); // Ajuste de zona horaria
    fechaCreacionFormateada = format(fechaFacturacion, 'dd/MM/yyyy');
  } else {
    fechaCreacionFormateada = 'Fecha inválida';
  }

  // Fecha fin gracia
  let fechaFormateada = '';
  if (isValid(parseISO(negociacion.fechaGracia))) {
    const fechaGracia = new Date(negociacion.fechaGracia);
    const fechaLocal = new Date(fechaGracia.getTime() + fechaGracia.getTimezoneOffset() * 60000);
    fechaFormateada = format(fechaLocal, 'dd/MM/yyyy');
  } else {
    fechaFormateada = 'Fecha inválida';
  }

  // Cálculo de las fechas y valores del Plan de pago
  const calcularPlanPago = () => {
    const fechaGracia = new Date(negociacion.fechaGracia)
    const numCuotas = parseInt(negociacion.numCuotas, 10);
    const valorCuota = parseFloat(negociacion.total) / numCuotas;
    const hoy = new Date(); // Obtener la fecha actual

    // console.log(fechaGracia)

    const planDePago = [];

    let fechaPago = new Date(fechaGracia.getTime());
    const cincoDias = 5 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < numCuotas; i++) {
      // Para la primera cuota, restar 5 días a la fecha de gracia
      if (i === 0) {
        fechaPago.setDate(fechaPago.getDate() - 5);
      } else {
        fechaPago.setDate(fechaPago.getDate() + 25); // Sumar 25 días a partir de la primera cuota
      }

      // Determinar el estado de la cuota
      let estadoCuota = '';
      const hoy = new Date();
      const cincoDias = 5 * 24 * 60 * 60 * 1000; // Cinco días en milisegundos

      if (hoy > fechaPago) {
        estadoCuota = 'Vencida';
      } else if (hoy >= fechaPago - cincoDias) {
        estadoCuota = 'Próxima a vencerse';
      } else {
        estadoCuota = 'Por pagar';
      }

      planDePago.push({
        numCuota: i + 1, // Número de cuota
        fecha: format(fechaPago, 'dd/MM/yyyy'),
        valor: valorCuota.toLocaleString('es-CO', { minimumFractionDigits: 0 }),
        estadoCuota: estadoCuota,
      });
    }

    return planDePago;
  };

  const negociacionPlanPagoData = calcularPlanPago();

  // console.log(negociacionPlanPagoData)
  return (

    <>
      <tr>
        <td>{negociacion.cliente}</td>
        <td>{negociacion.numFactura}</td>
        <td>{negociacion.numCuotas}</td>
        <td>{fechaFormateada}</td>
        <td>$ {parseFloat(negociacion.total).toLocaleString('es-CO')}</td>
        <td>{negociacion.estadoNegociacion}</td>
        <td style={{ textAlign: 'center' }}>
          <Link onClick={setShowModal}>
            <i className="fa fa-shopping-cart"
              title="Este icono permite visualizar los productos comprados dentro de la negociación"
              style={{ fontSize: '1.5rem', color: '#212529' }} />
          </Link>
        </td>
        <td style={{ textAlign: 'center' }}>
          <Link onClick={toggleDetalles} >
            <i className="fa fa-circle-info"
              title="Este icono da acceso a la ventana modal que contiene toda la información de la negociación"
              style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
          </Link>

          <Link onClick={toggleActivation}>
            <i
              className="fa fa-toggle-on"
              title="Este icono permite cambiar el estado de la negociación a activa o inactiva"
              style={{
                marginRight: 10,
                color: isActivated ? 'green' : 'gray',
                fontSize: 30,
                transition: 'transform 0.2s ease',
                transform: isActivated ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            />
          </Link>

          <Link onClick={togglePlanPagoModal}>
            <i className="fa fa-money"
              title="Este icono le permite visualizar el plan de pago dentro de la negociación"
              style={{ color: '#212529', fontSize: 22 }} />
          </Link>
        </td>

        {/* Modal Detalle Productos */}
        <Modal isOpen={showModal} onRequestClose={toggleModal} style={customStyles2}>
          <Link onClick={closeModal}>
            <FaTimes size={35} style={{ color: 'black', float: 'right' }} />
          </Link>
          <br />
          <h2 style={{ textAlign: 'center', color: '#032770' }}>DETALLE PRODUCTOS</h2>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px" }}>
              <thead className="table-secondary">
                <tr>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Producto</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Cantidad</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Precio Base</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Precio Venta</th>
                </tr>
              </thead>
              <tbody>
                {negociacion.tipoMaquina.map((producto, index) => (
                  <tr key={index}>
                    <td dangerouslySetInnerHTML={{ __html: producto }}></td>
                    <td dangerouslySetInnerHTML={{ __html: negociacion.cantidad[index] }}></td>
                    <td dangerouslySetInnerHTML={{ __html: Array.isArray(negociacion.precioBase) ? `$ ${parseFloat(negociacion.precioBase[index]).toLocaleString('es-CO')}` : '' }}></td>
                    <td dangerouslySetInnerHTML={{ __html: Array.isArray(negociacion.precioVenta) ? `$ ${parseFloat(negociacion.precioVenta[index]).toLocaleString('es-CO')}` : '' }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>

        {/* Modal Detalle Negociacion */}
        <Modal isOpen={mostrarDetalles} onRequestClose={toggleDetalles} style={customStyles} >
          <Link onClick={closeModal}>
            <FaTimes size={35} style={{ color: 'black', float: 'right' }} />
          </Link>
          <br />
          <h2 style={{ textAlign: 'center', color: '#032770' }}>DETALLE NEGOCIACIÓN</h2>
          <br />
          <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px" }}>
            <tbody style={{ border: "2px" }}>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Fecha Facturación</th>
                <td>{fechaCreacionFormateada}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Cliente</th>
                <td>{negociacion.cliente}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Factura</th>
                <td>{negociacion.numFactura}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Cuotas</th>
                <td>{negociacion.numCuotas}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Tasa de Interés</th>
                <td>{negociacion.tasa}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Anticipo</th>
                <td>{negociacion.anticipo}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Fecha Fin Gracia</th>
                <td>{fechaFormateada}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Subtotal</th>
                <td>$ {parseFloat(sumaSubtotales).toLocaleString('es-CO')}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Total</th>
                <td>$ {negociacion.total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</td>
              </tr>
            </tbody>
          </table>
          <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px" }}>
            <thead className="table-secondary">
              <tr>
                <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Producto</th>
                <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Cantidad</th>
                <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Precio Base</th>
                <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Precio Venta</th>
              </tr>
            </thead>
            <tbody>
              {negociacion.tipoMaquina.map((producto, index) => (
                <tr key={index}>
                  <td>{producto}</td>
                  <td>{negociacion.cantidad[index]}</td>
                  <td>
                    $ {parseFloat(negociacion.precioBase[index]).toLocaleString('es-CO')}
                  </td>
                  <td>
                    $ {parseFloat(negociacion.precioVenta[index]).toLocaleString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>

        {/* Modal Planes de Pago */}
        <Modal isOpen={showPlanPagoModal} onRequestClose={togglePlanPagoModal} style={customStyles2}>
          <Link onClick={closeModalPlanPago}>
            <FaTimes size={35} style={{ color: 'black', float: 'right' }} />
          </Link>
          <br />
          <h2 style={{ textAlign: 'center', color: "#032770" }}>PLAN DE PAGO</h2>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px" }}>
              <thead className="table-secondary">
                <tr>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Cuota</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Fecha</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Valor</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Estado</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Cumplimiento</th>
                  <th scope="col" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Notificar</th>
                </tr>
              </thead>
              <tbody>
                {negociacionPlanPagoData.map((item, index) => (
                  <tr
                    key={index}
                    className={cuotasPagadas[item.numCuota] ? 'row-pagada' : 'row-no-pagada'}
                  >
                    <td>{item.numCuota}</td>
                    <td>{item.fecha}</td>
                    <td>$ {item.valor}</td>
                    <td>{item.estadoCuota}</td>
                    <td key={item.numCuota} style={{ textAlign: 'center', position: 'relative' }}>
                      <select
                        value={cuotasPagadas[item.numCuota] ? 'pagada' : 'noPagada'}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'pagada') {
                            handleCuotaPagada(item.numCuota);
                          } else {
                            handleCuotaNoPagada(item.numCuota);
                          }
                        }}
                        style={{
                          fontSize: '15px',
                          padding: '4px',
                          borderRadius: '3px',
                          backgroundColor: cuotasPagadas[item.numCuota] ? '#699F29' : '#ED3131',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pagada">Paga</option>
                        <option value="noPagada">En deuda</option>
                      </select>
                      <span
                        style={{
                          position: 'absolute',
                          top: '-40px', // Ajusta la posición vertical
                          left: '50%', // Centra horizontalmente
                          transform: 'translateX(-50%)', // Centra horizontalmente
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontSize: '5px',
                        }}
                      >
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link
                        onClick={(e) => {
                          const tagI = document.querySelectorAll('.fa-bell');
                          tagI.forEach((identi, i) => {
                            identi.setAttribute('id', `${i}`);
                          });
                          console.log(e.target.id);
                          notificarPorEmail(e.target.id);
                        }}
                        // Agregar el atributo 'disabled' cuando estadoCuota no sea "Vencida"
                        disabled={item.estadoCuota !== 'Vencida'}
                      >
                        <i
                          className="fa fa-envelope"
                          title="Este icono permite notificar al cliente nuevamente su pago"
                          style={{
                            marginRight: 10,
                            color: item.estadoCuota === 'Vencida' ? '#212529' : 'gray', // Cambiar el color cuando deshabilitado
                            fontSize: 22,
                            cursor: item.estadoCuota === 'Vencida' ? 'pointer' : 'not-allowed', // Cambiar el cursor cuando deshabilitado
                          }}
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </tr>
    </>
  );
};

export default NegociacionIndividual;