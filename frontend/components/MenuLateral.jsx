
import { Link } from 'react-router-dom'
import Principal from './Principal'
import useAuth from '../hooks/useAuth'

import React, { useRef } from 'react'
import UsuariosBotonesComponente from './UsuariosBotonesComponente'

import logo from '../public/img/logo_letra2.png'

const MenuLateral = ({ componentePrincipal }) => {
    const { auth } = useAuth()
    const { cerrarSesion } = useAuth()

    const demoRef = useRef()
    const demoRefDos = React.createRef()


    return (

        <>
            {/* <div>MenuLateral</div> */}
            <span className='cerrarModal'>X</span>
            <section className="d-flex">

                <aside className="menuModal" id='menu_side'>



                    <ul className="d-flex flex-column justify-content-start w-100 px-0 my-0 mx-0  ">


                        <div className="d-flex justify-content-start align-items-center px-3 py-2">
                            <i className="py-3 ">
                                {/* <img className="rounded-circle "  src="https://e7.pngegg.com/pngimages/164/153/png-clipart-donut-the-simpsons-tapped-out-doughnut-homer-simpson-bart-simpson-krusty-the-clown-donut-food-bagel.png" alt="batman " title="batman" width="40" height="40" /> */}
                                {/* <img className="rounded-circle "   width="40" height="40" /> */}
                            </i>

                            {/* <p className="mb-0 mx-3 text-icon-menu">{auth.nombre} {auth.apellido}</p> */}
                            {/* <p className="mb-0 mx-3 text-icon-menu">Novotic</p> */}

                            <p id='contenedor-logo-imagen-lateral'>
                                <img id="logo-imagen-lateral" src={logo} alt="Bootstrap" />
                            </p>



                            {/* <Link className="navbar-brand" to="index.html">
                        <img id="" src={"../public/img/logo_letra2.png"} alt="Bootstrap" width="100" height="35" />
                    </Link> */}
                            {/* {children} */}
                        </div>


                        {/* <Link className="d-flex justify-content-start py-2 border-bottom border-dark" to="/admin/perfil">
                    <div className="d-flex  align-items-center ">
                        <i className="icon-menu fa-solid fa-address-card mx-4" title="Perfil"></i>
                        <p className="text-icon-menu my-0">Perfil</p>
                    </div>
                </Link> */}

                        <Link className="d-flex justify-content-start py-2 border-bottom  border-primary" to="/admin/listar-usuarios">
                            <div className="d-flex  align-items-center ">
                                <i className="icon-menu fa-solid fa-user-tie mx-4" title="Clientes"></i>
                                <p className="text-icon-menu my-0">Usuarios</p>
                            </div>
                        </Link>

                        <Link className="d-flex justify-content-start py-2 border-bottom border-primary" to="/admin/listaclientes">
                            <div className="d-flex  align-items-center ">
                                <i className="icon-menu fa-solid fa-user mx-4" title="Clientes"></i>
                                <p ref={demoRef} id='miId' className="text-icon-menu my-0">Clientes</p>
                                {/* <UsuariosBotonesComponente  demoRefDos={demoRef}/> */}
                                {/* <UsuariosBotonesComponente demoRefDos={demoRef}></UsuariosBotonesComponente> */}
                            </div>
                        </Link>

                        <Link className="d-flex justify-content-start py-2 border-bottom border-primary" to="/admin/listaproductos">
                            <div className="d-flex  align-items-center ">
                                <i className="icon-menu fa-solid fa-box-open mx-4" title="Clientes"></i>
                                <p className="text-icon-menu my-0">Productos</p>
                            </div>
                        </Link>

                        <Link className="d-flex justify-content-start py-2 border-bottom border-primary" to="/admin/listanegociaciones">
                            <div className="d-flex  align-items-center ">
                                <i className="icon-menu fa-solid fa-sack-dollar mx-4" title="Clientes"></i>
                                <p className="text-icon-menu my-0">Negociaciones</p>
                            </div>
                        </Link>

                        <Link className="d-flex justify-content-between  py-2 border-bottom border-primary" to="/admin/listaplandepago">
                            <div className="d-flex  align-items-center ">
                                <i className="icon-menu fa-solid fa-bell mx-4" title="Seguimiento"></i>
                                <p className="text-icon-menu my-0">Seguimiento</p>
                            </div>
                        </Link>

                        <Link className="d-flex li-cerrar-sesion justify-content-between  py-2 border-bottom border-primary" href="/" onClick={cerrarSesion}>
                            <div className="d-flex  align-items-center ">
                                <i className=" demo-ico fa-solid fa-person-walking-dashed-line-arrow-right mx-4" title="Salir"></i>
                                <p className="text-icon-menu my-0" >Salir</p>
                            </div>
                        </Link>



                        {/* <hr></hr>
                <a className="d-flex justify-content-between  py-2 border-bottom border-dark" href="login.html">
                    <div className="d-flex  align-items-center ">
                        <i className="icon-menu fa-solid fa-clipboard-user mx-4" title="Login"></i>
                        <p className="text-icon-menu my-0">Login</p>
                    </div>
                </a>

                <a className="d-flex justify-content-between  py-2 border-bottom border-dark" href="restablecer.html">
                    <div className="d-flex  align-items-center ">

                        <i className="icon-menu fa-solid fa-key mx-4" title="Recuperar"></i>
                        <p className="text-icon-menu my-0">recuperar</p>
                    </div>
                </a>

                <a className="d-flex justify-content-between  py-2 border-bottom border-dark" href="newPass.html">
                    <div className="d-flex  align-items-center ">

                        <i className="icon-menu fa-solid fa-user-lock mx-4" title="Planes de pago"></i>
                        <p className="text-icon-menu my-0">Nuevo pass</p>
                    </div>
                </a> */}

                    </ul>
                </aside>


                {/* <Principal></Principal> */}

                {componentePrincipal}


            </section>
        </>
    )
}

export default MenuLateral