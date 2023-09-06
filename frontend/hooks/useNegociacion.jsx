import { useContext } from 'react'
import NegociacionContext from '../context/NegociacionProvider'

const useNegociacion = () =>{
    return useContext(NegociacionContext)
}

export default useNegociacion;