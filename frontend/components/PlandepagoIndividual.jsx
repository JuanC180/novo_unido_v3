import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa'
import { isValid, format, parseISO } from 'date-fns';

const PlandepagoIndividual = ({ plandePago }) => {
    const { _id } = plandePago; // Obtén el _id del objeto cliente
    const { id } = useParams();
    const [mostrarDetalles, setMostrarDetalles] = useState(false); // Estado para controlar la ventana emergente
    const [dataNegociaciones, setDataNegociaciones] = useState([]);

    useEffect(() => {
        const url = `negociacion/obtenerNegociaciones`;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then(res => res.json())
            .then(data => {
                setDataNegociaciones(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const isCuotaProximaAVencerse = (cuota) => {
        return cuota.estadoCuota === "Próxima a vencerse";
    };

    const toggleDetalles = (negociacionId) => {
        setDataNegociaciones(prevData =>
            prevData.map(negociacion =>
                negociacion._id === negociacionId
                    ? { ...negociacion, mostrarDetalles: !negociacion.mostrarDetalles }
                    : negociacion
            )
        );
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

    const closeModal = () => {
        setMostrarDetalles(false);
        console.log("Modal cerrado"); // Puedes agregar un mensaje para verificar si se ejecutó correctamente
    };

    return (
        <>
            {dataNegociaciones.map(negociacion => (
                negociacion.detalleCuotas.some(isCuotaProximaAVencerse) && (
                    <tr key={negociacion._id}>
                        <td>{negociacion.cliente}</td>
                        <td>{negociacion.numFactura}</td>
                        <td>
                            {negociacion.detalleCuotas.map(cuota => (
                                isCuotaProximaAVencerse(cuota) && (
                                    <span key={cuota.fecha}>
                                        {isValid(parseISO(cuota.fecha)) ? (
                                            format(new Date(cuota.fecha), 'dd/MM/yyyy')
                                        ) : (
                                            'Fecha inválida'
                                        )}
                                    </span>
                                )
                            ))}
                        </td>
                        <td>
                            {negociacion.detalleCuotas.map(cuota => (
                                isCuotaProximaAVencerse(cuota) && (
                                    <span key={cuota.fecha}>
                                        $ {parseFloat(cuota.valor).toLocaleString('es-CO')}
                                    </span>
                                )
                            ))}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <Link onClick={() => toggleDetalles(negociacion._id)}>
                                <i className="fa fa-circle-info" title="Detalle" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
                            </Link>
                        </td>
                        <Modal isOpen={negociacion.mostrarDetalles} onRequestClose={closeModal} style={customStyles}>
                            <Link onClick={() => toggleDetalles(negociacion._id)}>
                                <FaTimes size={35} style={{ color: 'black', float: 'right' }} />
                            </Link>
                            <br />
                            <h2 style={{ textAlign: 'center', color: '#032770' }}>DETALLE NEGOCIACIÓN</h2>
                            <br />
                            <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px solid blue" }}>
                                <tbody style={{ border: "2px solid blue" }}>
                                    <tr>
                                        <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Fecha Facturación</th>
                                        <td style={{ color: '#032770' }}>{isValid(parseISO(negociacion.fechaFacturacion)) ? format(new Date(negociacion.fechaFacturacion), 'dd/MM/yyyy') : 'Fecha inválida'}</td>
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
                                        <td style={{ color: '#032770' }}>{isValid(parseISO(negociacion.fechaGracia)) ? format(new Date(negociacion.fechaGracia), 'dd/MM/yyyy') : 'Fecha inválida'}</td>
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
                    </tr>
                )
            ))}
        </>
    );
};

export default PlandepagoIndividual;