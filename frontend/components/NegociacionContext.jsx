import React, { createContext, useContext, useState } from 'react';

const NegociacionContext = createContext();

export const NegociacionProvider = ({ children }) => {
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    return (
        <NegociacionContext.Provider value={{ productosSeleccionados, setProductosSeleccionados}}>
            {children}
        </NegociacionContext.Provider>
    );
};

export const useNegociacionContext = () => useContext(NegociacionContext);
