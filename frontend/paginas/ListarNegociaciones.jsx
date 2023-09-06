import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import ListarNegociaciones from '../components/ListarNegociaciones'

const ListarNegociacion = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <ListarNegociaciones/>
      <Pie></Pie>
    </>
  )
}

export default ListarNegociacion