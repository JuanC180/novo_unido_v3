import React from 'react'

import Encabezado from '../../components/Encabezado'
import MenuLateral from '../../components/MenuLateral'
import Pie from '../../components/Pie'
import UsuariosBotonesComponente from '../../components/UsuariosBotonesComponente'

import { useRef } from 'react'

const UsuariosBotones = () => {
  const demoRef = useRef()
  return (
    <>
      {/* <div>UsuariosBotones</div> */}

      <Encabezado></Encabezado>
      <MenuLateral componentePrincipal={ <UsuariosBotonesComponente > </UsuariosBotonesComponente> } > 
      </MenuLateral>
      <Pie></Pie>

    </>
  )
}

export default UsuariosBotones