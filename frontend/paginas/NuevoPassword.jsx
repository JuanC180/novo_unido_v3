import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/axios"

import logo from '../public/img/Logo_10.png'

  const NuevoPassword = () => {

  const [password, setPassword] = useState('')
  const [alerta, setAlerta] =  useState({})
  const [tokenValido, setTokenValido] = useState(false)
  const [passswordModificado, setPasswordModificado] = useState(false)

  const params = useParams();
  const { token } = params


  useEffect(() =>{
    const comprobarToken = async () => {
      try {
        const {data} = await clienteAxios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        // console.log(data)
        // console.log(token)
        setAlerta({
          msg: 'Coloca tu Nuevo password'
        })
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: 'Hubo un error con el enlace',
          error: true
        })
        return
      }
    }
    comprobarToken()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password.length < 6){
      setAlerta({
        msg:'El passsword debe ser minimo 6 caracteres',
        error: true
      })
    }

    try {
      // const url = `http://localhost:4000/api/usuarios/olvide-password/${token}`
      const url = `/usuarios/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, {password} )
      // console.log(data)
      setAlerta({
        msg: data.msg
      })
      setPasswordModificado(true)
    } catch (error) {
      // console.log(error)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  const {msg} = alerta
    return (
      
      <>
      {/* <div>NuevoPassword dfdf</div> */}


      <div className="contenedor">

      <div className="contenedor-formulario">
          <div>
              {/* <img className="logoLogin" src="https://www.novomatic.com/sites/default/files/2017-05/Logo_N-Shortbrand.png" alt="logo" /> */}
              <img className="logoLogin" src={logo} alt="logo" />
          </div>
        <p className="tituloLogin">Restablecer su contraseña</p>

    
        {msg && <Alerta 
          alerta={alerta}
        />}

        {tokenValido && (
          <>
            <form onSubmit={handleSubmit} className='formularioLogin' action="index.html" id="formulario">
              <input  
                className='formulario-Input-password' 
                type="password" 
                id="password" 
                placeholder="Nuevo Password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
              />

              <div className="contendorBotones">
                <input type='submit' value="Restablecer "/>
              </div> 
              
            </form>
           
          </>

        )}

        {passswordModificado && 
          <Link className="tituloLogin text-white"  to="/">Iniciar Sesión</Link>
        }
        



      </div>
      </div>
      </>
    )
  }

export default NuevoPassword