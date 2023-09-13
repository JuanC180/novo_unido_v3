import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { isValid, format, parseISO } from 'date-fns';

import useNegociacion from '../hooks/useNegociacion';
import LinesChart from './graficos/LinesChart';
import BarsChart from './graficos/BarsChart';
import PiesChart from './graficos/PiesChart';
import Doughnuts from './graficos/DounghnutsChart';
import { Line } from 'react-chartjs-2';


import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';



const ListarPlandepago = () => {
    const [busqueda, setBusqueda] = useState("");
    const [dataNegociaciones, setDataNegociaciones] = useState([]);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const { auth } = useAuth()
    const [paginaActual, setPaginaActual] = useState(1);
    const plandepagoPorPagina = 5;



    const { negociacionMasVendida } = useNegociacion()

    console.log(negociacionMasVendida)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/negociacion/obtenerNegociaciones`);
                const data = await response.json();
                console.log(data)
                setDataNegociaciones(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
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
    };

    const filtrarNegociaciones = (negociaciones, busqueda) => {
        const negociacionesFiltradas = negociaciones.filter(negociacion =>
            negociacion.detalleCuotas.some(isCuotaProximaAVencerse) &&
            (
                busqueda === "" ||
                negociacion.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                negociacion.numFactura.includes(busqueda)
            )
        );

        return negociacionesFiltradas.length > 0 ? negociacionesFiltradas : null;
    };

    const paginarNegociaciones = (negociaciones, paginaActual, plandepagoPorPagina) => {
        const indexOfLastPlandepago = paginaActual * plandepagoPorPagina;
        const indexOfFirstPlandepago = indexOfLastPlandepago - plandepagoPorPagina;
        return negociaciones.slice(indexOfFirstPlandepago, indexOfLastPlandepago);
    };



    const araryNombres = []
    const arrayCantidades = []
    const arrayPorcentajes = []

    let suma1 = 0
    let porcentajes1 = 0
    // console.log( negociacionMasVendida)

    for (let i = 0; i < negociacionMasVendida.length; i++) {
        // console.log(negociacionMasVendida[i])
        araryNombres.push(negociacionMasVendida[i].nombre)
        arrayCantidades.push(negociacionMasVendida[i].cantidad)
        // arraySuma.push( negociacionMasVendida[i].cantidad )

        suma1 = suma1 + negociacionMasVendida[i].cantidad
        porcentajes1 = (negociacionMasVendida[i].cantidad / suma1) * 100

        console.log(porcentajes1)
    }


    //console.log(suma1, "total")
    //console.log(arrayCantidades, "todas ahi")

    for (let i = 0; i < arrayCantidades.length; i++) {
        arrayPorcentajes.push((arrayCantidades[i] / suma1) * 100)
    }

    //console.log(arrayPorcentajes)


    const data = {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: araryNombres,
        datasets: [
            {
                label: 'Cantidad',
                // data: [12, 19, 3, 30, 20, 3],
                data: arrayCantidades,
                /*  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                  ],*/
                borderWidth: 1,
            },
        ],
    };

    const backgroundColors = generateRandomColors(araryNombres.length)

    const data_barra = {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: araryNombres,
        datasets: [
            {
                label: 'Porcentaje',
                data: arrayCantidades,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
                borderWidth: 1,
            }
        ],
    };

    const data_pie = {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: araryNombres,
        datasets: [
            {
                label: 'Porcentaje',
                data: arrayPorcentajes,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
                borderWidth: 1,
            }
        ],
    };

    function generateRandomColors(numColors) {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            const alpha = 0.2
            const color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            colors.push(color)
        }
        return colors
    }


    const data2 = {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: araryNombres,
        datasets: [
            {
                label: 'Porcentaje',
                // data: [12, 19, 3, 30, 20, 3],
                data: arrayPorcentajes,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };






    useEffect(() => {
        const ctx = document.querySelector('.myChart');
        console.log(ctx)
        ctx.style.width = '300px'
        ctx.style.height = '300px'
        // ctx.style.backgroundColor = 'purple'

    }, [])


    function searchData(event) {
        event.preventDefault();
        setBusqueda(event.target.value);
        setPaginaActual(1); // Resetear la página cuando se inicia una nueva búsqueda
    }

    const negociacionesFiltradas = filtrarNegociaciones(dataNegociaciones, busqueda);
    const plandepagoPaginados = negociacionesFiltradas
        ? paginarNegociaciones(negociacionesFiltradas, paginaActual, plandepagoPorPagina)
        : [];

    const pageNumbers = negociacionesFiltradas ? Array.from({ length: Math.ceil(negociacionesFiltradas.length / plandepagoPorPagina) }, (_, index) => index + 1) : [];

    const paginador = pageNumbers.map((number) => (
        <li
            key={number}
            className={`page-item ${paginaActual === number ? 'active' : ''}`}
            onClick={() => setPaginaActual(number)}
        >
            <button className="page-link">{number}</button>
        </li>
    ));

    return (
        <>
            <section className="d-flex">
                <MenuLateral></MenuLateral>

                <main className="d-flex flex-column  border border-primary m-3 rounded">
                    <div className="contenedor-tabla mx-3">
                        <h3 className="py-0 pt-3 my-0">SEGUIMIENTO NOVOTIC</h3>

                        <div className='border border- m-3 rounded d-flex contener-graficas'>
                            {/* <div className='myChart border border-warning m-3 rounded  d-flex flex-column  bloque-grafica'>
                                <h5 className="py-0 pt-3 my-3 mx-3 text-center">DIAGRAMA 1</h5>
                                <LinesChart />
                            </div> */}


                            {/* <div className='border border-dark m-3 rounded '>
                                <div className='myChart d-flex flex-column justify-content-center'>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Producto maś vendido </h5>
                                    <LinesChart />
                                </div>
                            </div> */}

                            <div className='border border-dark m-3 rounded '>
                                <div className='myChart d-flex flex-column justify-content-center'>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Producto maś vendido </h5>
                                    <Bar options={options} data={data_barra} />
                                </div>
                            </div>


                            <div className='border border-dark m-3 rounded justify-content-center'>
                                <div className='myChart d-flex flex-column '>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Producto más vendido</h5>
                                    <Doughnut options={options} data={data_pie} />
                                </div>
                            </div>


                        </div>

                        <h3 className="py-0 pt-3 my-0">Seguimiento planes de pago</h3>
                        <div className="contenerdor-boton-buscar my-4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 blo1 my-1">
                                    <Link className="text-center" to="/admin/crearplandepago">
                                        {/* <button type="submit" className="btn btn-dark px-3 btn-styles">Agregar nuevo plan de pago</button> */}
                                    </Link>
                                </div>

                                <div className="col-sm-12 col-md-6 blo2 my-1">
                                    <form action="" className="div-search">
                                        <input type="text" className="search-style form-control rounded-pill" value={busqueda} onChange={searchData}
                                            placeholder="Buscar" />
                                    </form>
                                </div>
                            </div>
                        </div>

                        <table className="table table-hover mb-5 border">
                            <thead className="table-secondary">

                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Factura</th>
                                    <th scope="col">Fecha Límite de Pago</th>
                                    <th scope="col">Valor a Pagar</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {negociacionesFiltradas ? (
                                    negociacionesFiltradas.map(negociacion => (
                                        <tr key={negociacion._id}>
                                            <td>{negociacion.cliente}</td>
                                            <td>{negociacion.numFactura}</td>
                                            <td>
                                                {negociacion.detalleCuotas
                                                    .filter(isCuotaProximaAVencerse)
                                                    .map(cuota => (
                                                        <span key={cuota.fecha}>
                                                            {isValid(parseISO(cuota.fecha)) ? (
                                                                format(new Date(cuota.fecha), 'dd/MM/yyyy')
                                                            ) : (
                                                                'Fecha inválida'
                                                            )}
                                                        </span>
                                                    ))}
                                            </td>
                                            <td>
                                                {negociacion.detalleCuotas
                                                    .filter(isCuotaProximaAVencerse)
                                                    .map(cuota => (
                                                        <span key={cuota.fecha}>
                                                            $ {parseFloat(cuota.valor).toLocaleString('es-CO')}
                                                        </span>
                                                    ))}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Link onClick={() => toggleDetalles(negociacion._id)}>
                                                    <i
                                                        className="fa fa-circle-info"
                                                        title="Detalle"
                                                        style={{ marginRight: 10, color: '#212529', fontSize: 22 }}
                                                    />
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
                                                            <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Tasa de Interés</th>
                                                            <td style={{ color: '#032770' }}>{negociacion.tasa}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" style={{ backgroundColor: "#032770", color: 'white' }}>Anticipo</th>
                                                            <td style={{ color: '#032770' }}>{negociacion.anticipo}</td>
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">
                                            <div>
                                                <h5 style={{ textAlign: 'center' }}>No se encontraron resultados</h5>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <nav className="d-flex justify-content-center">
                        <ul className="pagination gap-0 justify-content-center">
                            {paginador}
                        </ul>
                    </nav>
                </main>
            </section>
        </>
    );
};

export default ListarPlandepago;