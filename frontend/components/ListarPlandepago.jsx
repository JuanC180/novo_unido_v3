import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import PlandePagoIndividual from '../components/PlandepagoIndividual';
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';

import useNegociacion from '../hooks/useNegociacion';
import LinesChart from './graficos/LinesChart';
import BarsChart from './graficos/BarsChart';
import PiesChart from './graficos/PiesChart';
import Doughnuts from './graficos/DounghnutsChart';
import { Line } from 'react-chartjs-2';


import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';



const ListarPlandepago = () => {
    const [dataplandePago, setdataPlandePago] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const { auth } = useAuth()



    const { negociacionMasVendida } = useNegociacion()

    console.log(negociacionMasVendida)

    useEffect(() => {
        const url = `plandepago/obtenerplandepago`;
        // fetch('http://localhost:4000/api/plandepago/obtenerplandepago')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener los datos del plan de pago');
                }
                return res.json();
            })
            .then((data) => {
                // console.log(data);
                setdataPlandePago(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);




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


    console.log(suma1, "total")
    console.log(arrayCantidades, "todas ahi")

    for (let i = 0; i < arrayCantidades.length; i++) {
        arrayPorcentajes.push((arrayCantidades[i] / suma1) * 100)
    }

    console.log(arrayPorcentajes)


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
    }

    const filteredPlandePago = dataplandePago.filter((plandePago) => {
        return (
            (typeof plandePago.fechaPago === 'string' && plandePago.fechaPago.toLowerCase().includes(busqueda.toLowerCase())) ||
            (typeof plandePago.valorPago === 'string' && plandePago.valorPago.toLowerCase().includes(busqueda.toLowerCase())) ||
            (typeof plandePago.cumplioPago === 'string' && plandePago.cumplioPago.toLowerCase().includes(busqueda.toLowerCase()))
        );
    });

    const listaPlandePagos = filteredPlandePago.length > 0 ? (
        filteredPlandePago.map(plandePago => (
            <PlandePagoIndividual key={plandePago._id} plandePago={plandePago} />
        ))
    ) : (
        <tr>
            <td colSpan="12">
                <div>
                    <h5 style={{ textAlign: 'center' }}>No se encontraron resultados</h5>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <section className="d-flex">
                <MenuLateral></MenuLateral>

                <main className="d-flex flex-column  border border-primary m-3 rounded">
                    <div className="contenedor-tabla mx-3">
                        <h3 className="py-0 pt-3 my-0">REPORTES</h3>

                        <div className='border border-success m-3 rounded d-flex contener-graficas'>
                            <div className='border border-warning m-3 rounded bloque-grafica'>
                                <LinesChart />
                            </div>

                            <div className='border border-dark m-3 rounded '>
                                <div className='myChart d-flex flex-column justify-content-center'>
                                    <Bar options={options} data={data_barra} />
                                </div>
                            </div>

                            <div className='border border-danger m-3 rounded'>
                                <div className='myChart d-flex flex-column justify-content-center'>
                                    <Doughnut options={options} data={data_pie} />
                                </div>
                            </div>


                        </div>

                        <h3 className="py-0 pt-3 my-0">SEGUIMIENTO PLANES DE PAGO</h3>
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

                                {listaPlandePagos}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
        </>
    );
};

export default ListarPlandepago;