import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import CrearPlandePago from '../components/CrearPlandepago'

const FormCrear = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <CrearPlandePago />
      <Pie></Pie>
    </>
  )
}

export default FormCrear