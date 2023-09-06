import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import CrearProducto from '../components/CrearProducto'

const FormCrearProducto = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <CrearProducto/>
      <Pie></Pie>
    </>
  )
}

export default FormCrearProducto