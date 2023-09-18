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


import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';


import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ListarPlandepago = () => {
    const [busqueda, setBusqueda] = useState("");
    const [dataNegociaciones, setDataNegociaciones] = useState([]);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const { auth } = useAuth()
    const [paginaActual, setPaginaActual] = useState(1);
    const plandepagoPorPagina = 5;



    const { negociacionMasVendida, valorTotalNegociacion, negociaciones } = useNegociacion()



    //console.log(negociaciones)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/negociacion/obtenerNegociaciones`);
                const data = await response.json();
                //console.log(data)
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
    const arrayFechasMongo = []
    const arrayNombreMes = []
    const arrayContadorMes = []

    let cantidadEnMes = 0

    let suma1 = 0
    let porcentajes1 = 0

    const date = new Date()
    const fechaActual = date.toISOString()
    const fActual = new Date(fechaActual)

    const contadorMeses = {}; // Objeto para llevar un registro de las cantidades de cada mes

    negociaciones.forEach((negociacion) => {
        const fecha = new Date(Date.parse(negociacion.fechaFacturacion));

        if (!isNaN(fecha)) {
            const options = { month: 'long' };
            const fechaTexto = fecha.toLocaleDateString('es-ES', options);

            const texto = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1)

            if (contadorMeses[texto]) {
                contadorMeses[texto]++;
            } else {
                contadorMeses[texto] = 1;
            }
        } else {
            console.log(`Fecha no válida: ${negociacion.fechaFacturacion}`);
        }
    });



    // Imprime el contador de meses
    for (const mes in contadorMeses) {
        //console.log(`${mes}: ${contadorMeses[mes]} veces`);
        arrayNombreMes.push(mes)
        arrayContadorMes.push(contadorMeses[mes])
        cantidadEnMes = cantidadEnMes + contadorMeses[mes]
    }


    for (let i = 0; i < negociacionMasVendida.length; i++) {
        // console.log(negociacionMasVendida[i])
        araryNombres.push(negociacionMasVendida[i].nombre)
        arrayCantidades.push(negociacionMasVendida[i].cantidad)
        // arraySuma.push( negociacionMasVendida[i].cantidad )

        suma1 = suma1 + negociacionMasVendida[i].cantidad
        porcentajes1 = (negociacionMasVendida[i].cantidad / suma1) * 100

        //console.log(porcentajes1)
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
                label: 'Cantidad',
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

    const data_total = {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: ['Negociociones'],
        datasets: [
            {
                label: 'Total',
                data: [valorTotalNegociacion],
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
                borderWidth: 1,
            }
        ],
    };


    const data_mese = {
        //labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        labels: arrayNombreMes,
        datasets: [
            {
                label: "Cantidad",
                data: arrayContadorMes,
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(255,99,132)',
                backgroundColor: 'rgba(255,99,132,0.5',
                pointRadius: 5,
                pointBorderColor: 'rgba(255,99,132)',
                pointBackgroundColor: 'rgba(255,99,132'
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

    let mioptions = {
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scale: {
            y: {
                min: 0,
                max: cantidadEnMes
            },
            x: {
                tick: { color: 'rgba(0,220,195)' }
            }
        },

    }






    useEffect(() => {
        const ctx = document.querySelector('.myChart');
        //console.log(ctx)
        ctx.style.width = '300px'
        ctx.style.height = '300px'
        // ctx.style.backgroundColor = 'purple'

    }, [])


    function searchData(event) {
        const { value } = event.target;
      
        setBusqueda(value);
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

                            <div className='border border-dark m-3 rounded bloque-grafica'>
                                <div className='myChart d-flex flex-column justify-content-center'>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Producto maś vendido </h5>
                                    <Bar options={options} data={data_barra} />
                                </div>
                            </div>

                            <div className='border border-dark m-3 rounded bloque-grafica '>
                                <div className='myChart d-flex flex-column justify-content-center '>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Valor total - Negociaciones </h5>
                                    <Bar options={options} data={data_total} />
                                </div>
                            </div>

                            <div className='border border-dark m-3 rounded bloque-grafica '>
                                <div className='myChart d-flex flex-column justify-content-center'>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Ventas por mes </h5>
                                    {/* <LinesChart /> */}
                                    <Line options={mioptions} data={data_mese} />
                                </div>
                            </div>

                            {/*  <div className='border border-dark m-3 rounded justify-content-center'>
                                <div className='myChart d-flex flex-column '>
                                    <h5 className="py-0 pt-3 my-3 mx-3 text-center">Producto más vendido</h5>
                                    <Doughnut options={options} data={data_pie} />
                                </div>
                            </div> */ }

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
                                    <input
  type="text"
  className="search-style form-control rounded-pill"
  value={busqueda}
  onChange={searchData}
  placeholder="Buscar"
/>

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
                                                        title="Este icono da acceso a la ventana modal que contiene toda la información de la negociación correspondiente a la cuota"
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
                                                <table className="table table-hover mb-5 table-bordered" style={{ maxWidth: 800, border: "2px" }}>
                                                    <tbody style={{ border: "2px" }}>
                                                        <tr>
                                                            <th scope="row" style={{ backgroundColor: "#4B4B4B", color: 'white' }}>Fecha Facturación</th>
                                                            <td>{isValid(parseISO(negociacion.fechaFacturacion)) ? format(new Date(negociacion.fechaFacturacion), 'dd/MM/yyyy') : 'Fecha inválida'}</td>
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
                                                            <td>{isValid(parseISO(negociacion.fechaGracia)) ? format(new Date(negociacion.fechaGracia), 'dd/MM/yyyy') : 'Fecha inválida'}</td>
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