import React from 'react'
import Encabezado from '../components/Encabezado'
import MenuLateral from '../components/MenuLateral'
import Pie from '../components/Pie'

import logo from '../public/img/Logo_1.png'

const Admin = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <MenuLateral></MenuLateral>


      <main className="d-flex flex-column  border border-primary m-3 rounded align-items-center justify-content-center" id='main'>
        <div className="contenedor-tabla mx-3">

          <div className="contenerdor-boton-buscar my-4">
            <div className="row">
              <div className="col-sm-12 col-md-6 blo1 my-1">
                <a className="text-center" to="/admin/registrar">

                </a>
              </div>

              <div className="col-sm-12 col-md-6 blo2 my-1">
                <form action="" className="div-search">

                </form>
              </div>
            </div>
          </div>

          {/*<img className="logoPrincipal mx-auto d-block " src={logo} alt="logo" height={400} /> */}




          <nav className="d-flex justify-content-center navPaginador">
            <ul className="pagination gap-0 justify-content-center">

            </ul>
          </nav>
        </div>
      </main>

      <Pie></Pie>
    </>
  )
}

export default Admin