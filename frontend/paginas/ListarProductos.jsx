import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import ListarProductos from '../components/ListarProductos'

const ListarProducto = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <ListarProductos/>
      <Pie></Pie>
    </>
  )
}

export default ListarProducto