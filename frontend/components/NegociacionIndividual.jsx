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
  const {negociaciones} = useNegociacion()

  const [isActivated, setIsActivated] = useState(false);
  const [estado, setEstado] = useState(negociacion.estado);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPlanPagoModal, setShowPlanPagoModal] = useState(false);
  const [cuotasPagadas, setCuotasPagadas] = useState({});

  // console.log(negociaciones)

  //Función para traer los datos del cliente y poder enviar la notificación
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
  const notificarPorEmail = ( iteracion) => {


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
      .then(res => res.json() )
      .then(data =>{
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
      height: '590px',
      margin: 'auto',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  const customStyles2 = {
    content: {
      width: '900px',
      height: '590px',
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
            <i className="fa fa-shopping-cart" style={{ fontSize: '1.5rem', color: '#212529' }} />
          </Link>
        </td>
        <td style={{ textAlign: 'center' }}>
          <Link onClick={toggleDetalles} >
            <i className="fa fa-circle-info" title="Detalle" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
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

          <Link onClick={togglePlanPagoModal}>
            <i className="fa fa-money" title="Plan de pago" style={{ color: '#212529', fontSize: 22 }} />
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
            <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
              <thead className="table-secondary" style={{ border: "2px solid blue" }}>
                <tr>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Producto</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Cantidad</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Precio Base</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Precio Venta</th>
                </tr>
              </thead>
              <tbody>
                {negociacion.tipoMaquina.map((producto, index) => (
                  <tr key={index}>
                    <td style={{ color: '#032770' }} dangerouslySetInnerHTML={{ __html: producto }}></td>
                    <td style={{ color: '#032770' }} dangerouslySetInnerHTML={{ __html: negociacion.cantidad[index] }}></td>
                    <td style={{ color: '#032770' }} dangerouslySetInnerHTML={{ __html: Array.isArray(negociacion.precioBase) ? `$ ${parseFloat(negociacion.precioBase[index]).toLocaleString('es-CO')}` : '' }}></td>
                    <td style={{ color: '#032770' }} dangerouslySetInnerHTML={{ __html: Array.isArray(negociacion.precioVenta) ? `$ ${parseFloat(negociacion.precioVenta[index]).toLocaleString('es-CO')}` : '' }}></td>
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
          <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
            <tbody style={{ border: "2px solid blue" }}>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Fecha Facturación</th>
                <td style={{ color: '#032770' }}>{fechaCreacionFormateada}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Cliente</th>
                <td style={{ color: '#032770' }}>{negociacion.cliente}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Factura</th>
                <td style={{ color: '#032770' }}>{negociacion.numFactura}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Cuotas</th>
                <td style={{ color: '#032770' }}>{negociacion.numCuotas}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Tasa</th>
                <td style={{ color: '#032770' }}>{negociacion.tasa}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Anticipo</th>
                <td style={{ color: '#032770' }}>{negociacion.anticipo}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Intereses</th>
                <td style={{ color: '#032770' }}>{negociacion.interes}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Fecha Fin Gracia</th>
                <td style={{ color: '#032770' }}>{fechaFormateada}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Subtotal</th>
                <td style={{ color: '#032770' }}>$ {parseFloat(sumaSubtotales).toLocaleString('es-CO')}</td>
              </tr>
              <tr>
                <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Total</th>
                <td style={{ color: '#032770' }}>$ {negociacion.total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</td>
              </tr>
            </tbody>
          </table>
          <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
            <thead className="table-secondary" style={{ border: "2px solid blue" }}>
              <tr>
                <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Producto</th>
                <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Cantidad</th>
                <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Precio Base</th>
                <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Precio Venta</th>
              </tr>
            </thead>
            <tbody>
              {negociacion.tipoMaquina.map((producto, index) => (
                <tr key={index}>
                  <td style={{ color: '#032770' }}>{producto}</td>
                  <td style={{ color: '#032770' }}>{negociacion.cantidad[index]}</td>
                  <td style={{ color: '#032770' }}>
                    $ {parseFloat(negociacion.precioBase[index]).toLocaleString('es-CO')}
                  </td>
                  <td style={{ color: '#032770' }}>
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
            <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
              <thead className="table-secondary" style={{ border: "2px solid blue" }}>
                <tr>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Cuota</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Fecha</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Valor</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Estado</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Cumplimiento</th>
                  <th scope="col" style={{ backgroundColor: "#032770", color: 'white' }}>Notificar</th>
                </tr>
              </thead>
              <tbody>
                {negociacionPlanPagoData.map((item, index) => (
                  <tr
                    key={index}
                    className={cuotasPagadas[item.numCuota] ? 'row-pagada' : 'row-no-pagada'}
                  >
                    <td style={{ color: '#032770' }}>{item.numCuota}</td>
                    <td style={{ color: '#032770' }}>{item.fecha}</td>
                    <td style={{ color: '#032770' }}>$ {item.valor}</td>
                    <td style={{ color: '#032770' }}>{item.estadoCuota}</td>
                    <td key={item.numCuota} style={{ textAlign: 'center' }}>
                      <span>
                        {/* Marcar como pagada */}
                        <FaCheck
                          className={`green-icon ${cuotasPagadas[item.numCuota] ? 'active' : ''}`} title="Pagada"
                          style={{ fontSize: 20, cursor: 'pointer', color: '#699F29' }}
                          onClick={() => handleCuotaPagada(item.numCuota)}
                        />
                        {/* Marcar como no pagada */}
                        <FaTimes
                          className={`red-icon ${!cuotasPagadas[item.numCuota] ? 'active' : ''}`} title="No pagada"
                          style={{ fontSize: 22, marginLeft: 30, cursor: 'pointer', color: '#ED3131' }}
                          onClick={() => handleCuotaNoPagada(item.numCuota)}
                        />
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {/* <Link onClick={toggleDetalles} > */}
                      <Link onClick={(e)=> 
                        { 
                          const tagI = document.querySelectorAll('.fa-bell')
                          tagI.forEach((identi, i) => {
                            identi.setAttribute('id', `${i}`);
                          })
                          console.log(e.target.id)
                          notificarPorEmail(e.target.id)
                        }
                      } 
                      >
                        <i className="fa fa-bell" 
                        
                        title="Notificar" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
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