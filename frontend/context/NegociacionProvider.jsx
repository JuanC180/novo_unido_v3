import { useState, useEffect, createContext } from 'react'

const NegociacionContext = createContext();

const NegociacionProvider = ({ children }) => {

    const [negociaciones, setNegociaciones] = useState({})
    const [negociacionMasVendida, setNegociacionMasVendida] = useState({})
    const [valorTotalNegociacion, setValorTotalNegociacion] = useState({})

    /*
    useEffect(() => {
        const obtenerNegociacion = async () => {
            const url = `negociacion/obtenerNegociaciones`;
            // `${import.meta.env.VITE_BACKEND_URL}/api/${url}`
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Error al obtener los datos de la negociación');
                    }
                    return res.json();
                })
                .then((data) => {
                    setNegociaciones(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        obtenerNegociacion()
    }, [])

    */

    useEffect(() => {
        const obtenerNegociacion = async () => {
            const url = `negociacion/obtenerNegociaciones`;
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la negociación');
                }
                const data = await response.json();
                setNegociaciones(data)
                return data;
            } catch (error) {
                console.log(error);
                return null;
            }
        }

        const obtenerMaquinasMasVendidas = async () => {
            let maaquinas = await obtenerNegociacion()

            //console.log(maaquinas)

            let datos2 = []
            let maquinasAgrupadas = {}

            maaquinas.forEach(maquina => {
                const nombresMaquinas = maquina.tipoMaquina;
                const cantidadesMaquinas = maquina.cantidad;

                nombresMaquinas.forEach((nombre, index) => {
                    if (!maquinasAgrupadas[nombre]) {
                        maquinasAgrupadas[nombre] = {
                            nombre,
                            cantidad: cantidadesMaquinas[index]
                        };
                    } else {
                        maquinasAgrupadas[nombre].cantidad += cantidadesMaquinas[index];
                    }
                })
            });
            datos2 = Object.values(maquinasAgrupadas);
            setNegociacionMasVendida(datos2)
        }

        const obtenerValorTotalNegociacion = async () => {
            let maquinas = await obtenerNegociacion()
            let suma = 0

            maquinas.forEach(maquina => {
                suma = suma + maquina.total
            })

            setValorTotalNegociacion(suma)
        }


        obtenerNegociacion();
        obtenerMaquinasMasVendidas();
        obtenerValorTotalNegociacion()
    }, [])

    return (
        <NegociacionContext.Provider
            value={{
                negociaciones,
                setNegociaciones,
                negociacionMasVendida,
                valorTotalNegociacion
            }}
        >
            {children}
        </NegociacionContext.Provider>
    )
}

export {
    NegociacionProvider
}

export default NegociacionContext;