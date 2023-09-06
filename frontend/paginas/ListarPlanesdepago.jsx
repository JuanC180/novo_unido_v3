import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import ListarPlandepago from '../components/ListarPlandepago'

const Listar = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <ListarPlandepago/>
      <Pie></Pie>
    </>
  )
}

export default Listar