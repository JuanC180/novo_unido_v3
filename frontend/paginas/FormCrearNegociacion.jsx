import React from 'react'
import Encabezado from '../components/Encabezado'
import Pie from '../components/Pie'
import CrearNegociacion from '../components/CrearNegociacion'

const FormCrearNegociacion = () => {
  return (
    <>
      <Encabezado></Encabezado>
      <CrearNegociacion/>
      <Pie></Pie>
    </>
  )
}

export default FormCrearNegociacion