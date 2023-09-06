import React from 'react'
import Encabezado from '../../components/Encabezado'
import MenuLateral from '../../components/MenuLateral'
import CambiarPassword from '../usuarios/CambiarPassword'
import Pie from '../../components/Pie'

const CambiarPasswordCarga = () => {
  return (
    <>
        {/* <div>CambiarPasswordCarga</div> */}

        <Encabezado></Encabezado>
        <MenuLateral componentePrincipal={<CambiarPassword />}>
        </MenuLateral>
        <Pie></Pie>

    </>
  )
}

export default CambiarPasswordCarga