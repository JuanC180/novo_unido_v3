import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import NegociacionIndividual from './NegociacionIndividual';
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';

import useNegociacion from '../hooks/useNegociacion';

const ListarNegociaciones = () => {
    const [datanegociaciones, setdatanegociacion] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const negociacionesPorPagina = 5;
    const [negociacionesFiltradas, setNegociacionesFiltradas] = useState([]);
    const { auth } = useAuth()


    useEffect(() => {
        const url = `negociacion/obtenerNegociaciones`;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener los datos de la negociación');
                }
                return res.json();
            })
            .then((data) => {
                // console.log(data);
                setdatanegociacion(data);
                setNegociacionesFiltradas(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    function searchData(event) {
        const searchValue = event.target.value;
        setBusqueda(searchValue);
    
        const filteredNegociaciones = datanegociaciones.filter((negociacion) => {
            return (
                negociacion.numFactura && negociacion.numFactura.toLowerCase().includes(searchValue.toLowerCase()) ||
                negociacion.cliente && negociacion.cliente.toString().includes(searchValue)
            );
        });
    
        setNegociacionesFiltradas(searchValue ? filteredNegociaciones : datanegociaciones);
        setPaginaActual(1);
    }
    
    const indexOfLastNegociacion = paginaActual * negociacionesPorPagina;
    const indexOfFirstNegociacion = indexOfLastNegociacion - negociacionesPorPagina;
    const negociacionesPaginadas = negociacionesFiltradas.slice(indexOfFirstNegociacion, indexOfLastNegociacion);

    const listanegociaciones = negociacionesPaginadas.length === 0 ? (
        <tr>
            <td colSpan="12">
                <div>
                    <h5 style={{ textAlign: 'center' }}>No se encontraron resultados</h5>
                </div>
            </td>
        </tr>
    ) : (
        negociacionesPaginadas.map((negociacion) => {
            return <NegociacionIndividual key={negociacion._id} negociacion={negociacion} />;
        })
    );

    // Paginador
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(negociacionesFiltradas.length / negociacionesPorPagina); i++) {
        pageNumbers.push(i);
    }

    const paginador = pageNumbers.map((number) => {
        return (
            <li
                key={number}
                className={`page-item ${paginaActual === number ? 'active' : ''}`}
                onClick={() => setPaginaActual(number)}
            >
                <button className="page-link">{number}</button>
            </li>
        );
    });

    return (
        <>
        
            <section className="d-flex">
                <MenuLateral></MenuLateral>

                <main className="d-flex flex-column  border border-primary m-3 rounded">
                    <div className="contenedor-tabla mx-3">
                        <h3 className="py-0 pt-3 my-0">LISTADO NEGOCIACIONES</h3>

                        <div className="contenerdor-boton-buscar my-4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 blo1 my-1">
                                    <Link className="text-center" to="/admin/crearnegociacion">
                                        <button type="submit" className="btn btn-dark px-3 btn-styles">Agregar nueva negociación</button>
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
                        <div className="table-container" style={{ overflowX: 'auto' }}>
                            <table className="table table-hover mb-5 border">
                                <thead className="table-secondary">
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Factura</th>
                                        {/* <th scope="col" style={{ textAlign: 'center' }}>Productos</th> */}
                                        <th scope="col">Cuotas</th>
                                        <th scope="col">Fecha Fin Gracia</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Productos</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listanegociaciones}
                                </tbody>
                            </table>
                        </div>
                        <nav className="d-flex justify-content-center">
                            <ul className="pagination gap-0 justify-content-center">
                                {paginador}
                            </ul>
                        </nav>
                        {/* <div style={{textAlign:'end'}}>
                            <button className="btn btn-primary m-3" >
                                Generar Reportes
                            </button>
                        </div> */}
                        
                    </div>
                </main>
            </section>
            
        </>
    );
};

export default ListarNegociaciones;