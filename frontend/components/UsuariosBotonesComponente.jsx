import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import UsuarioIndividual from './UsuarioIndividual'
import MenuLateral from './MenuLateral'

const UsuariosBotonesComponente = () => {

    const [usuarios, setUsuarios] = useState([])
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 5;
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([])

    useEffect(() => {
        fetch('http://localhost:4000/api/usuarios/obtener-usuarios')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                return res.json();
            })
            .then((data) => {
                // Convertir el correo a minúscula antes de guardar los datos
                const usuariosLowerCase = data.map((usuario) => ({
                    ...usuario,
                    correo: usuario.correo.toLowerCase(),
                }));

                setUsuarios(usuariosLowerCase);
                setUsuariosFiltrados(usuariosLowerCase);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    function searchDate(e) {
        e.preventDefault();
        const searchValue = e.target.value;
        setBusqueda(searchValue);

        const usuariosFiltrados = usuarios.filter((usuario) => {
            return (
                usuario.nombre && usuario.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                usuario.apellido && usuario.apellido.toLowerCase().includes(searchValue.toLowerCase()) ||
                usuario.email && usuario.email.toLowerCase().includes(searchValue.toLowerCase())

            );
        });

        setUsuariosFiltrados(usuariosFiltrados);
        setPaginaActual(1)
    }

    const indexOfLastUsuario = paginaActual * usuariosPorPagina;
    const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indexOfFirstUsuario, indexOfLastUsuario)

    const listaUsuarios =
        usuariosPaginados.length === 0 ? (
            <tr>
                <td colSpan="6">
                    <div>
                        <h5 style={{ textAlign: 'center' }}>No se encontraron resultados</h5>
                    </div>
                </td>
            </tr>
        ) : (
            usuariosPaginados.map((usuario) => <UsuarioIndividual key={usuario._id} usuario={usuario} />)
        );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(usuariosFiltrados.length / usuariosPorPagina); i++) {
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

                <main className="d-flex flex-column  border border-primary m-3 rounded" id='main'>
                    <div className="contenedor-tabla mx-3">
                        <h3 className="py-0 pt-3 my-0">LISTADO USUARIOS</h3>
                        <div className="contenerdor-boton-buscar my-4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 blo1 my-1">
                                    <Link className="text-center" to="/admin/registrar">
                                        <button type="submit" className="btn btn-dark px-3 btn-styles">Agregar nuevo usuario</button>
                                    </Link>
                                </div>

                                <div className="col-sm-12 col-md-6 blo2 my-1">
                                    <form action="" className="div-search">
                                        <input type="text" className="search-style form-control rounded-pill" value={busqueda} onChange={searchDate}
                                            placeholder="Buscar" />
                                    </form>
                                </div>
                            </div>
                        </div>

                        <table className="table table-hover mb-5">
                            <thead className="table-secondary">
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaUsuarios}
                            </tbody>
                        </table>
                        <nav className="d-flex justify-content-center navPaginador">
                            <ul className="pagination gap-0 justify-content-center">
                                {paginador}
                            </ul>
                        </nav>
                    </div>
                </main>
            </section>
        </>
    );
}

export default UsuariosBotonesComponente;