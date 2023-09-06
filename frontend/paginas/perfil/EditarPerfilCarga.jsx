import React from 'react'
// import Encabezado from '../../components/Encabezado'
// import Encabezado from '../../components/Encabezado'
// import Encabezado from '../../components/Encabezado'
// import MenuLateral from '../../components/MenuLateral'
import MenuLateral from '../../components/MenuLateral'

// import EditarPerfilComponente from '../perfil/EditarPerfil'
import EditarPerfilComponente from '../perfil/EditarPerfil'

// import Pie from '../../components/Pie'
import Pie from '../../components/Pie'
import Encabezado from '../../components/Encabezado'

const EditarPerfilCarga = () => {
  return (
    <>
        {/* <div>EditarPerfil</div> */}
        <Encabezado></Encabezado>
        <MenuLateral componentePrincipal={<EditarPerfilComponente/>}>
        </MenuLateral>
        <Pie></Pie>

    </>
  )
}

export default EditarPerfilCarga