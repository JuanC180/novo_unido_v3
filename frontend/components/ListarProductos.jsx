import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import ProductoIndividual from './ProductoIndividual';
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';

const ListarProductos = () => {
    const [dataproductos, setdataproducto] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const { auth } = useAuth();
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 5;
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    useEffect(() => {
        const url = `producto/obtenerProducto`;
        // fetch('http://localhost:4000/api/producto/obtenerProducto')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener los datos del producto');
                }
                return res.json();
            })
            .then((data) => {
                setdataproducto(data);
                setProductosFiltrados(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    function searchData(event) {
        event.preventDefault();
        const searchValue = event.target.value;
        setBusqueda(searchValue);

        const productosFiltrados = dataproductos.filter((producto) => {
            return (
                producto.referencia.toLowerCase().includes(searchValue.toLowerCase()) ||
                producto.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                producto.precioBase.toString().includes(searchValue)
            );
        });

        setProductosFiltrados(productosFiltrados);
        setPaginaActual(1);
    }

    const indexOfLastProducto = paginaActual * productosPorPagina;
    const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
    const productosPaginados = productosFiltrados.slice(indexOfFirstProducto, indexOfLastProducto);

    const listaproductos =
        productosPaginados.length === 0 ? (
            <tr>
                <td colSpan="6">
                    <div>
                        <h5 style={{ textAlign: 'center' }}>No se encontraron resultados</h5>
                    </div>
                </td>
            </tr>
        ) : (
            productosPaginados.map((producto) => <ProductoIndividual key={producto._id} producto={producto} />)
        );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(productosFiltrados.length / productosPorPagina); i++) {
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
                        <h3 className="py-0 pt-3 my-0">LISTADO PRODUCTOS</h3>
                        <div className="contenerdor-boton-buscar my-4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 blo1 my-1">
                                    <Link className="text-center" to="/admin/crearproducto">
                                        <button type="submit" className="btn btn-dark px-3 btn-styles">Agregar nuevo producto</button>
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
                            <table className="table table-hover mb-5" style={{ overflowX: 'auto' }}>
                                <thead className="table-secondary">
                                    <tr>
                                        <th scope="col">Referencia</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Precio Base</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaproductos}
                                </tbody>
                            </table>
                        </div>
                        <nav className="d-flex justify-content-center">
                            <ul className="pagination gap-0 justify-content-center">
                                {paginador}
                            </ul>
                        </nav>
                    </div>
                </main>
            </section>
        </>
    );
};

export default ListarProductos;