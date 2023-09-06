import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import CrearCliente from '../components/CrearCliente'

const FormCrear = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <CrearCliente/>
      <Pie></Pie>
    </>
  )
}

export default FormCrear