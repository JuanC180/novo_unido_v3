import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import clienteAxios from '../config/axios';
import axios from 'axios';
import Alerta from '../components/Alerta'
import { Link } from 'react-router-dom';

import logo from '../public/img/Logo_10.png'

const ConfirmarCuenta =  () => {

  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true)
  const [alerta, setAlerta] = useState({})
  
  const params = useParams();
  const { id } = params;

// console.log("hola")
useEffect(() => {
  const confirmarCuenta = async () =>{
    try {
      // const url = `http://localhost:4000/api/usuarios/confirmar/${id}`
      const url = `/usuarios/confirmar/${id}`
      const { data } = await clienteAxios(url)
      setAlerta({
        msg: data.msg
      })
      setCuentaConfirmada(true)
    } catch (error) {
      setAlerta({
        msg:error.response.data.msg,
        error:true
    })
    }
    setCargando(false)
  }
  confirmarCuenta()
},[])


  


  return (
    <>
      {/* <div>ConfirmarCuenta</div> */}

      <div className="contenedor">
        <div className="contenedor-formulario">
            <div>
                {/* <img className="logoLogin" src="https://www.novomatic.com/sites/default/files/2017-05/Logo_N-Shortbrand.png" alt="logo" /> */}
                <img className="logoLogin" src={logo} alt="logo" />
            </div>
          <p className="tituloLogin tituloConfirmarCuenta">Confirmar Cuenta</p>

          
          {!cargando && <Alerta alerta={alerta} />}

          {cuentaConfirmada && (
            <Link to="/">Iniciar Sesión</Link>
          )}


            {/* <form className='formularioLogin' action="index.html" id="formulario">
                <input  className='formulario-Input-Text' type="text" id="correo" placeholder="Correo" required />


                <div className="contendorBotones">
                    <input type='submit' value="Enviar"/>
                </div>
            </form> */}

        </div>
      </div>

    </>
  )
}

export default ConfirmarCuenta