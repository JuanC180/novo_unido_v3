import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'


import ListarClientes from './ListarClientes'

const Encabezado = () => {
    const { cerrarSesion } = useAuth()
    const { auth } = useAuth()

    const [estadoLateral, setEstadoLateral] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            // console.log('La pantalla ha cambiado de tamaño');

            const main = document.querySelector('main')
            const width = main.offsetWidth
            //   main.style.backgroundColor = 'purple'
            //   console.log("cambiado main con mouse",width)

        };

        const cambiadoDivMain = () => {
            const main = document.querySelector('main')
            const width = main.offsetWidth
            // console.log("cambiado main con click", width)
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('resize', cambiadoDivMain)

        // Limpia el listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', cambiadoDivMain)
        };
    }, []);

    const modalMenuLateral = (e) => {
        e.preventDefault()


        const header = document.querySelector("header")
        const aside = document.querySelector("aside")
        const main = document.querySelector("main")
        const footer = document.querySelector(".main__footer")
        const toggleAsideButton = document.getElementById("toggleAsideButton")

        aside.classList.toggle("aside-hidden")

        main.classList.toggle("main-expanded")

        footer.classList.toggle("footer-expanded")

        header.classList.toggle("header-expanded")


    }



    return (
        <header className="py-0">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid mx-sm-1 mx-1 mx-lg-5">

                    <Link className="navbar-brand" onClick={modalMenuLateral} >
                        <div className="icon__menu">
                            <i className="fas fa-bars btn_open" id="btn_open"></i>
                        </div>
                        {/* <img id="imgLogo" src={"https://www.novomatic.com/themes/novomatic/images/novomatic_n.svg"} alt="Bootstrap" width="35" height="35" /> */}
                    </Link>
                    {/* <button className="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
                    <div className=" d-lg-flex justify-content-lg-end" id="navbarNav">
                        <ul className="navbar-nav d-flex justify-content-center align-items-center gap-1 gap-lg-4 my-0">
                            <li className="nav-item hover-header py-0 ">

                                <Link className="text-decoration-none text-white " >
                                    <div className="dropdown">
                                        {/* <img id="imgLogo" src={"https://www.novomatic.com/themes/novomatic/images/novomatic_n.svg"} alt="Bootstrap" width="35" height="35" /> */}
                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {/* Dropdown button dropdown-toggle*/}
                                            <p className='user-name'>{auth.nombre} {auth.apellido}</p>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <Link to="/admin/perfil">
                                                <button className="dropdown-item" type="button">
                                                    <i className="icono-margin fa-solid fa-address-card"></i>
                                                    Perfil
                                                </button>
                                            </Link>
                                            <Link to="/admin/cambiar-password">
                                                <button className="dropdown-item" type="button">
                                                    <i className="icono-margin fa-solid fa-key"></i>
                                                    Modificar contraseña
                                                </button>
                                            </Link>

                                        </ul>
                                        {/* <img id="imgLogo" src={"https://www.novomatic.com/themes/novomatic/images/novomatic_n.svg"} alt="Bootstrap" width="35" height="35" /> */}
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>





                </div>
            </nav>
        </header>

    )
}

export default Encabezado