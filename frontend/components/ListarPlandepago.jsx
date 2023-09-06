import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import PlandePagoIndividual from '../components/PlandepagoIndividual';
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';

const ListarPlandepago = () => {
    const [dataplandePago, setdataPlandePago] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const { auth } = useAuth()

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