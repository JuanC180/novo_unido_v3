import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { parseISO } from 'date-fns';
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';

const CrearNegociacion = () => {
    const navigate = useNavigate();

    const [dataclientes, setDataClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState({ _id: '', nombre: '' });
    // const [selectedCliente, setSelectedCliente] = useState('');
    const [numFactura, setNumFactura] = useState('');
    const [dataproductos, setDataProductos] = useState([]);
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [cantidad, setCantidad] = useState([]);
    const [precioBase, setPrecioBase] = useState([]);
    const [precioVenta, setPrecioVenta] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [numCuotas, setNumCuotas] = useState('');
    const [tasa, setTasa] = useState('');
    const [anticipo, setAnticipo] = useState('');
    const [fechaGracia, setFechaGracia] = useState('');
    const [total, setTotal] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [numFacturaError, setNumFacturaError] = useState(false);
    const [tasaError, setTasaError] = useState(false);
    const [anticipoError, setAnticipoError] = useState(false);
    const [totalError, setTotalError] = useState(false);
    const [cantidadError, setCantidadError] = useState([]);
    const [precioVentaError, setPrecioVentaError] = useState([]);

    const handleCancelar = () => {
        navigate(-1); // Regresa a la ubicación anterior
    };
    const { auth } = useAuth()

    useEffect(() => {
        const url = `cliente/obtenerCliente`
        // fetch('http://localhost:4000/api/cliente/obtenerCliente')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then(res => res.json())
            .then(data => {
                setDataClientes(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const url = `producto/obtenerProducto`
        // fetch('http://localhost:4000/api/producto/obtenerProducto')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then(res => res.json())
            .then(data => {
                setDataProductos(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    function validarNumericos(event, setErrorState, longitudMinima) {
        const charCode = event.keyCode || event.which;
        const char = String.fromCharCode(charCode);

        // Permitir la tecla de retroceso (backspace) y la tecla de suprimir (delete)
        if (charCode === 8 || charCode === 46 || charCode === 9) {
            return;
        }

        // Verificar si el carácter no es un número del 0 al 9
        if (/\D/.test(char)) {
            event.preventDefault();
            return;
        }

        const inputText = event.target.value;

        // Remover caracteres no numéricos, excepto el punto decimal
        const sanitizedText = inputText.replace(/[^\d.]/g, '');

        // Actualizar el valor del input con el texto sanitizado
        event.target.value = sanitizedText;

        // Validar longitud mínima
        if (sanitizedText.length < longitudMinima) {
            setErrorState(true);
        } else {
            setErrorState(false);
        }
    }

    //Eliminar los productos del listado de comprados
    function eliminarProducto(index) {
        const productosActualizados = [...productosSeleccionados];
        productosActualizados.splice(index, 1);
        setProductosSeleccionados(productosActualizados);
    }

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Calcular la fecha máxima permitida (último día del séptimo mes)
    const fechaMaxima = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 7, 0);

    // Calcular la fecha mínima permitida (primer día del mes actual)
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    // Convertir las fechas a formato ISO
    const fechaActualISO = fechaActual.toISOString().split('T')[0];
    const fechaMinimaISO = primerDiaDelMes.toISOString().split('T')[0];
    const fechaMaximaISO = fechaMaxima.toISOString().split('T')[0];

    const agregarNegociacion = async () => {

        // Verificar que todos los campos sean llenados
        if (
            selectedCliente === '' ||
            numFactura === '' ||
            numCuotas === '' ||
            tasa === '' ||
            anticipo === '' ||
            fechaGracia === '' ||
            total === ''
        ) {
            swal({
                title: "Campos vacíos",
                text: "Todos los campos son obligatorios",
                icon: "warning",
                button: "Aceptar"
            });
            return
        }

        if (
            numFacturaError ||
            anticipoError ||
            tasaError ||
            totalError ||
            cantidadError.some(error => error) || // Verificar si al menos un elemento en cantidadError es true
            precioVentaError.some(error => error)
        )

            swal({
                title: "Datos incorrectos",
                text: "Verifica los campos marcados en rojo",
                icon: "error",
                button: "Aceptar"
            });

        for (let i = 0; i < selectedProductos.length; i++) {
            if (!cantidad[i] || !precioVenta[i] || !productosSeleccionados[i]) {
                swal({
                    title: "Campos vacíos",
                    text: "Todos los campos son obligatorios",
                    icon: "warning",
                    button: "Aceptar"
                });
                return;
            }
        }

        const tipoMaquinaArray = productosSeleccionados.map((producto) => producto.tipoMaquina);
        const cantidadArray = productosSeleccionados.map((producto) => Number(producto.cantidad));
        const precioBaseArray = productosSeleccionados.map((producto) => Number(producto.precioBase));
        const precioVentaArray = productosSeleccionados.map((producto) => Number(producto.precioVenta));

        const nuevaNegociacion = {
            // cliente: selectedCliente,
            cliente: {
                _id: selectedCliente._id,
                nombre: selectedCliente.nombre,
            },
            numFactura,
            tipoMaquina: tipoMaquinaArray,
            cantidad: cantidadArray,
            precioBase: precioBaseArray,
            precioVenta: precioVentaArray,
            numCuotas,
            tasa,
            anticipo,
            fechaGracia: parseISO(fechaGracia),
            total,
            productos: productosSeleccionados, // Agregar productos seleccionados
        };

        try {
            const url = `negociacion/agregarNegociacion`
            // const response = await fetch(`http://localhost:4000/api/negociacion/agregarNegociacion`, {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaNegociacion)
            });

            const data = await response.json();

            if (response.ok) {
                swal({
                    title: "Negociación Creada Correctamente",
                    icon: "success",
                    buttons: {
                        accept: {
                            text: "Aceptar",
                            value: true,
                            visible: true,
                            className: "btn-primary",
                            closeModal: true
                        }
                    }
                }).then((value) => {
                    if (value) {
                        window.location.href = "/admin/listanegociaciones";
                    }
                });
            } else {

                if (data.msg) {
                    throw new Error(data.msg);
                } else {
                    throw new Error(data.error);
                }
            }
        } catch (error) {
            console.error(error);

            let errorMessage = "Ocurrió un error"; // Mensaje por defecto
            if (error.message) {
                errorMessage = error.message; // Usar el mensaje de error específico si está disponible
            }

            swal({
                title: "Error",
                text: errorMessage,
                icon: "error",
                button: "Aceptar"
            });
        }
    }

    const agregarProducto = () => {
        if (selectedProductos.length === 0) {
            console.log('Debe seleccionar al menos un producto');
            swal({
                title: "Debe Agregar al menos un producto",
                text: "",
                icon: "warning",
                button: "Aceptar"
            });
            return;
        }

        const obtenerPrecioBase = (producto) => {
            const productoEncontrado = dataproductos.find((p) => p.nombre === producto);
            return productoEncontrado ? productoEncontrado.precioBase : '';
        };

        const nuevosProductos = selectedProductos.map((producto, index) => ({
            tipoMaquina: producto,
            cantidad: Number(cantidad[index]), // Convertir la cadena a número
            precioBase: Number(obtenerPrecioBase(producto)),
            precioVenta: Number(precioVenta[index]),
        }));

        setCantidad(prevCantidad => [...prevCantidad, ...nuevosCantidad]);
        setPrecioBase(prevPrecioBase => [...prevPrecioBase, ...nuevosPreciosBase]);
        setPrecioVenta(prevPrecioVenta => [...prevPrecioVenta, ...nuevosPreciosVenta]);

        const nuevosCantidad = nuevosProductos.map((producto) => producto.cantidad);
        const nuevosPreciosBase = nuevosProductos.map((producto) => producto.precioBase); // Obtener el array de precios base
        const nuevosPreciosVenta = nuevosProductos.map((producto) => producto.precioVenta);

        setProductosSeleccionados((prevProductos) => {
            const nuevosProductosSeleccionados = [...prevProductos, ...nuevosProductos];
            console.log(nuevosProductosSeleccionados);
            return nuevosProductosSeleccionados;
        });

        // Almacenar los precios base en un estado separado
        setPrecioBase(prevPreciosBase => [...prevPreciosBase, ...nuevosPreciosBase]);
    };

    const limpiarCampos = () => {
        setSelectedProductos([]);
        setCantidad([]);
        setPrecioVenta([]);
    };

    return (
        <>
            <section className="d-flex">
                <MenuLateral></MenuLateral>


                <main className="d-flex flex-column  border border-primary m-3 rounded">
                    <h3 className="text-center py-0 pt-3 my-0">CREAR NEGOCIACIÓN</h3>
                    <br />
                    <form className="formulario" action="">
                        <div className="contenedores d-flex justify-content-center flex-lg-row flex-column flex-sm-column mx-5 gap-5">
                            <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100">
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Cliente</label>
                                    <select
                                        id="cliente"
                                        className="form-select"
                                        value={selectedCliente._id}
                                        onChange={(e) => setSelectedCliente({ _id: e.target.value, nombre: e.target.options[e.target.selectedIndex].text })}
                                    >
                                        <option value="">Seleccionar cliente</option>
                                        {dataclientes
                                            .filter((cliente) => cliente.estado === 'Activo') // Filtrar solo clientes en estado "Activo"
                                            .map((cliente) => (
                                                <option key={cliente._id} value={cliente._id}>
                                                    {cliente.nombre}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Cantidad Cuotas</label>
                                    <select className="form-select" required value={numCuotas} onChange={(e) => { setNumCuotas(e.target.value) }}>
                                        <option value="">Seleccionar</option>
                                        {Array.from({ length: 24 }, (_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Anticipo</label>
                                    <input
                                        type="text"
                                        className={`form-control ${anticipoError ? 'is-invalid' : ''}`}
                                        placeholder="Porcentaje anticipo"
                                        required
                                        maxLength={4}
                                        value={anticipo}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            setAnticipo(inputValue);
                                            setAnticipoError(inputValue < 0.01 || inputValue > 1);
                                        }}
                                        onKeyDown={(e) => {
                                            // Obtener el carácter presionado
                                            const charTyped = e.key;

                                            // Permitir solo números y un punto decimal
                                            if (
                                                (charTyped < '0' || charTyped > '9') && // Números
                                                charTyped !== '.' && // Punto decimal
                                                charTyped !== 'Backspace' && // Tecla de retroceso (backspace)
                                                charTyped !== 'Tab' // Tecla de tabulación (tab)
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {anticipoError && <div className="invalid-feedback">El anticipo debe estar entre 0.01 y 1.</div>}
                                </div>

                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Total</label>
                                    <input
                                        type="text"
                                        className={`form-control ${totalError || (total && parseFloat(total) < 33000000) ? 'is-invalid' : ''}`}
                                        placeholder="$"
                                        required
                                        maxLength={9}
                                        onInput={(e) => validarNumericos(e, setErrorState, 8)}
                                        value={total}
                                        onChange={(e) => {
                                            setTotal(e.target.value);
                                            if (e.target.value.length < 8) {
                                                setTotalError(true);
                                            } else {
                                                setTotalError(false);
                                            }
                                        }}
                                    />
                                    {totalError && parseFloat(total) < 33000000 && <div className="invalid-feedback">El total debe ser mínimo $33.000.000</div>}
                                </div>
                                <h2>Seleccionar Productos</h2>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Producto</label>
                                    <select
                                        id="producto"
                                        className="form-select"
                                        required
                                        value={selectedProductos.join(',')}
                                        onChange={(e) =>
                                            setSelectedProductos(
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )}>
                                        <option value="">Seleccionar producto</option>
                                        {dataproductos
                                            .filter((producto) => producto.estado === 'Activo') // Filtrar solo productos en estado "Activo"
                                            .map((producto) => (
                                                <option key={producto.id} value={producto.nombre}>
                                                    {producto.nombre}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Precio venta</label>
                                    {selectedProductos.length > 0 ? (
                                        selectedProductos.map((producto, index) => (
                                            <div key={index} className="mb-3">
                                                <input
                                                    type="text"
                                                    className={`form-control ${precioVentaError[index] ? 'is-invalid' : ''}`}
                                                    placeholder="$"
                                                    required
                                                    maxLength={9}  // Ajustar la longitud máxima según tus necesidades
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Eliminar caracteres no numéricos y puntos
                                                        const nuevosValores = [...precioVenta];
                                                        nuevosValores[index] = e.target.value;
                                                        setPrecioVenta(nuevosValores);

                                                        const parsedValue = parseFloat(e.target.value.replace(/\./g, ''));
                                                        if (parsedValue < 33000000) {
                                                            setPrecioVentaError(prevErrors => {
                                                                const newErrors = [...prevErrors];
                                                                newErrors[index] = true;
                                                                return newErrors;
                                                            });
                                                        } else {
                                                            setPrecioVentaError(prevErrors => {
                                                                const newErrors = [...prevErrors];
                                                                newErrors[index] = false;
                                                                return newErrors;
                                                            });
                                                        }
                                                    }}
                                                    value={precioVenta[index] || ''}
                                                    onChange={(e) => {
                                                        const nuevosValores = [...precioVenta];
                                                        nuevosValores[index] = e.target.value;
                                                        setPrecioVenta(nuevosValores);
                                                    }}
                                                />
                                                {precioVentaError[index] && <div className="invalid-feedback">El precio de venta debe ser al menos $33.000.000.</div>}
                                            </div>
                                        ))
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="$"
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
                                <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Factura</label>
                                        <input
                                            type="text"
                                            className={`form-control ${numFacturaError ? 'is-invalid' : ''}`}
                                            placeholder="Número de Factura"
                                            required
                                            maxLength={6}
                                            value={numFactura}
                                            onChange={(e) => {
                                                const inputText = e.target.value;
                                                const sanitizedText = inputText.replace(/[^a-zA-Z0-9]/g, '');
                                                setNumFactura(sanitizedText);

                                                // Usar una expresión regular para validar la factura
                                                const facturaRegex = /^[a-zA-Z0-9]{6}$/;
                                                if (facturaRegex.test(sanitizedText)) {
                                                    setNumFacturaError(false);
                                                } else {
                                                    setNumFacturaError(true);
                                                }
                                            }}
                                        />
                                        {numFacturaError && <div className="invalid-feedback">El número de factura debe tener dos letras seguidas de cuatro números.</div>}
                                    </div>
                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Tasa de Interés</label>
                                        <input
                                            type="text" // Cambiar de "number" a "text"
                                            className={`form-control ${tasaError ? 'is-invalid' : ''}`}
                                            placeholder="Porcentaje tasa"
                                            required
                                            maxLength={4}
                                            value={tasa}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setTasa(inputValue);
                                                setTasaError(inputValue < 0.01 || inputValue > 1);
                                            }}
                                            onKeyDown={(e) => {
                                                // Obtener el carácter presionado
                                                const charTyped = e.key;

                                                // Permitir solo números y un punto decimal
                                                if (
                                                    (charTyped < '0' || charTyped > '9') && // Números
                                                    charTyped !== '.' && // Punto decimal
                                                    charTyped !== 'Backspace' && // Tecla de retroceso (backspace)
                                                    charTyped !== 'Tab' // Tecla de tabulación (tab)
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        {tasaError && <div className="invalid-feedback">La tasa debe estar entre 0.01 y 1.</div>}
                                    </div>

                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Fecha Fin Gracia</label>
                                        <input type="date" className="form-control" placeholder="Fecha Facturación" required
                                            value={fechaGracia}
                                            onChange={(e) => setFechaGracia(e.target.value)}
                                            min={fechaMinimaISO} // Establecer la fecha mínima permitida (mes actual)
                                            max={fechaMaximaISO} // Establecer la fecha máxima permitida (6 meses a partir de la fecha actual)
                                        />
                                    </div>

                                    <div className="mb-3 w-100">
                                        {/* <label className="form-label fw-bold"></label>
                                        <input type="text" className="form-control" }} /> */}
                                        {/* <label className="form-label fw-bold"></label>
                                        <input type="text" className="form-control" }} /> */}
                                        {/* <label className="form-label fw-bold"></label>
                                        <input type="text" className="form-control" }} /> */}
                                    </div>
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Cantidad</label>
                                        {selectedProductos.length > 0 ? (
                                            selectedProductos.map((producto, index) => (
                                                <div key={index} className="mb-3">
                                                    <input
                                                        type="text"
                                                        className={`form-control ${cantidadError[index] ? 'is-invalid' : ''}`}
                                                        placeholder="Cantidad"
                                                        required
                                                        maxLength={2}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
                                                            const nuevosValores = [...cantidad];
                                                            nuevosValores[index] = e.target.value;
                                                            setCantidad(nuevosValores);

                                                            if (e.target.value < 1) {
                                                                setCantidadError(prevErrors => {
                                                                    const newErrors = [...prevErrors];
                                                                    newErrors[index] = true;
                                                                    return newErrors;
                                                                });
                                                            } else {
                                                                setCantidadError(prevErrors => {
                                                                    const newErrors = [...prevErrors];
                                                                    newErrors[index] = false;
                                                                    return newErrors;
                                                                });
                                                            }
                                                        }}
                                                        value={cantidad[index] || ''}
                                                        onChange={(e) => {
                                                            const nuevosValores = [...cantidad];
                                                            nuevosValores[index] = e.target.value;
                                                            setCantidad(nuevosValores);
                                                        }}
                                                    />
                                                    {cantidadError[index] && <div className="invalid-feedback">La cantidad debe ser al menos 1.</div>}
                                                </div>
                                            ))
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Cantidad"
                                                disabled
                                            />
                                        )}
                                    </div>
                                    <br />
                                    <div>
                                        <button type="button" className="btn btn-dark " id="producto" required value={selectedProductos} onChange={e => setSelectedProductos(e.target.value)} onClick={agregarProducto} style={{ marginRight: 10 }}><i className="fa fa-add" /></button>
                                        <button type="button" className="btn btn-dark" onClick={limpiarCampos}><i className="fa fa-broom" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <table className="table table-hover mb-5 border" style={{ maxWidth: 800 }}>
                                <thead className="table-secondary">
                                    <tr>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Precio Base</th>
                                        <th scope="col">Precio Venta</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosSeleccionados.map((producto, index) => (
                                        <tr key={producto.id || index}>
                                            <td>{producto.tipoMaquina}</td>
                                            <td>{producto.cantidad}</td>
                                            <td>$ {parseFloat(producto.precioBase).toLocaleString('es-CO')}</td>
                                            <td>$ {parseFloat(producto.precioVenta).toLocaleString('es-CO')}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Link>
                                                    <FaTimes size={35} style={{ color: 'black' }} onClick={() => eliminarProducto(index)} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones ms-sm-0 w-100 d-flex justify-content-center">
                                    <button type="button" className="btn btn-dark btn-styles" onClick={agregarNegociacion}>Guardar</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones me-sm-0 w-100 d-flex justify-content-center">
                                    <button type="button" className="btn btn-dark btn-styles" onClick={handleCancelar}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </section>
        </>
    )
}

export default CrearNegociacion