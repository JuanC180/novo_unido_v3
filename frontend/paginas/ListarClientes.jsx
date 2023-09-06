import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import ListarClientes from '../components/ListarClientes'

const Listar = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <ListarClientes/>
      <Pie></Pie>
    </>
  )
}

export default Listar