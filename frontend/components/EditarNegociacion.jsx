import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import MenuLateral from './MenuLateral';
import Encabezado from './Encabezado';
import Pie from './Pie';

const EditarNegociacion = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    //Hooks
    const [dataclientes, setDataClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [numFactura, setNumFactura] = useState('');
    const [dataproductos, setDataProductos] = useState([]);
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [cantidad, setCantidad] = useState('');
    const [precioVenta, setPrecioVenta] = useState([]);
    const [numCuotas, setNumCuotas] = useState('');
    const [tasa, setTasa] = useState('');
    const [anticipo, setAnticipo] = useState('');
    const [interes, setInteres] = useState('');
    const [fechaGracia, setFechaGracia] = useState('');
    const [total, setTotal] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [precioBase, setPrecioBase] = useState('');
    const [numFacturaError, setNumFacturaError] = useState(false);
    const [tasaError, setTasaError] = useState(false);
    const [anticipoError, setAnticipoError] = useState(false);
    const [interesesError, setInteresesError] = useState(false);
    const [totalError, setTotalError] = useState(false);
    const [cantidadError, setCantidadError] = useState(false);
    const [precioVentaError, setPrecioVentaError] = useState(false);
    const { auth } = useAuth()
    const [datanegociaciones, setdatanegociacion] = useState([]);

    const handleCancelar = () => {
        navigate(-1); // Regresa a la ubicación anterior
    };

    useEffect(() => {
        const url = `negociacion/obtenerNegociaciones`;
        // fetch('http://localhost:4000/api/negociacion/obtenerNegociaciones')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then(res => res.json())
            .then(data => {
                setdatanegociacion(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [id]);

    useEffect(() => {
        const url = `negociacion/obtenerdatanegociacion/${id}`
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al obtener los datos de la negociación');
                }
                return res.json();
            })
            .then((datanegociacion) => {
                setSelectedCliente(datanegociacion.cliente);
                setNumFactura(datanegociacion.numFactura)
                setSelectedProductos(datanegociacion.tipoMaquina);
                setCantidad(datanegociacion.cantidad);
                setPrecioBase(datanegociacion.precioBase)
                setPrecioVenta(datanegociacion.precioVenta);
                setNumCuotas(datanegociacion.numCuotas);
                setTasa(datanegociacion.tasa);
                setAnticipo(datanegociacion.anticipo);
                setInteres(datanegociacion.interes);
                // Convertir la fecha al formato "YYYY-MM-DD" antes de asignarla al estado
                if (datanegociacion.fechaGracia) {
                    const fechaGraciaFormatted = new Date(datanegociacion.fechaGracia)
                        .toISOString()
                        .slice(0, 10);
                    setFechaGracia(fechaGraciaFormatted);
                } else {
                    setFechaGracia('');
                }

                setTotal(datanegociacion.total);
                setProductosSeleccionados(datanegociacion.productosSeleccionados);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    useEffect(() => {
        const url = ``;
        // fetch('http://localhost:4000/api/cliente/obtenerCliente')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then((res) => res.json())
            .then((data) => {
                setDataClientes(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const url = `producto/obtenerProducto`;
        // fetch('http://localhost:4000/api/producto/obtenerProducto')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`)
            .then((res) => res.json())
            .then((data) => {
                setDataProductos(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function validarNumericos(event) {
        const charCode = event.keyCode || event.which;
        const char = String.fromCharCode(charCode);

        // Permitir la tecla de retroceso (backspace) y la tecla de suprimir (delete)
        if (charCode === 8 || charCode === 46 || charCode === 9) {
            return;
        }

        // Verificar si el carácter no es un número del 0 al 9 ni el punto decimal
        if (/[\D/.-]/.test(char)) {
            event.preventDefault();
        }

        // Verificar que no haya más de un punto decimal
        if (char === '.' && event.target.value.includes('.')) {
            event.preventDefault();
        }
    }

    //Función para actualizar
    const actualizarNegociacion = async () => {

        // Verificar que todos los campos sean llenados
        if (
            selectedCliente === '' ||
            numFactura === '' ||
            numCuotas === '' ||
            cantidad === '' ||
            precioVenta === '' ||
            tasa === '' ||
            anticipo === '' ||
            interes === '' ||
            fechaGracia === '' ||
            total === ''
        ) {
            swal({
                title: "1 Campo vacíos",
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
            interesesError ||
            totalError ||
            cantidadError ||
            precioVentaError
        ) {
            swal({
                title: "Datos incorrectos",
                text: "Verifica los campos marcados en rojo",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }

        const negociacionActualizada = {
            cliente: selectedCliente,
            numFactura,
            tipoMaquina: selectedProductos,
            cantidad,
            precioVenta,
            numCuotas,
            tasa,
            anticipo,
            interes,
            fechaGracia,
            total,
            productosSeleccionados,
            precioBase
        };

        //Petición usando fetch
        try {
            const url = `negociacion/actualizarNegociacion/${id}`
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(negociacionActualizada)
            });

            if (response.ok) {
                const data = await response.json();
                swal({
                    title: "Actualización exitosa",
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
                throw new Error('Error al actualizar la negociación');
            }
        } catch (error) {
            console.error(error);
            swal({
                title: "Error",
                text: "Ha ocurrido un error al actualizar la negociación.",
                icon: "error",
                buttons: {
                    accept: {
                        text: "Aceptar",
                        value: true,
                        visible: true,
                        className: "btn-danger",
                        closeModal: true
                    }
                }
            });
        }
    };

    return (
        <>
            <section className="d-flex">

                <Encabezado></Encabezado>
                <MenuLateral></MenuLateral>

                <main className="d-flex flex-column  border border-primary m-3 rounded">
                    <h3 className="text-center py-0 pt-3 my-0">EDITAR NEGOCIACIÓN</h3>
                    <br />
                    <form className="formulario" action="">
                        <div className="contenedores d-flex justify-content-center flex-lg-row flex-column flex-sm-column mx-5 gap-5">
                            <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100">
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Cliente</label>
                                    <select className="form-select" value={selectedCliente}
                                        onChange={(e) => setSelectedCliente(e.target.value)}>
                                        <option value="">Seleccione un cliente</option>
                                        {dataclientes.map((cliente) => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Cantidad Cuotas</label>
                                    <select className="form-select" required value={numCuotas} onChange={(e) => { setNumCuotas(e.target.value) }}>
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
                                    <label className="form-label fw-bold">Fecha Fin Gracia</label>
                                    <input type="date" className="form-control" placeholder="Fecha Facturación" required value={fechaGracia} onChange={(e) => { setFechaGracia(e.target.value) }} />
                                </div>
                            </div>
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

                                            if (sanitizedText.length < 6) {
                                                setNumFacturaError(true);
                                            } else {
                                                setNumFacturaError(false);
                                            }
                                        }}
                                    />
                                    {numFacturaError && <div className="invalid-feedback">El número de factura debe tener al menos 6 caracteres.</div>}
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Tasa</label>
                                    <input
                                        type="text"
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
                                    <label className="form-label fw-bold">Interes</label>
                                    <input
                                        type="text"
                                        className={`form-control ${interesesError ? 'is-invalid' : ''}`}
                                        placeholder="Porcentaje interes"
                                        required
                                        maxLength={4}
                                        value={interes}
                                        onChange={(e) => {
                                            const inputValue = parseFloat(e.target.value);
                                            setInteres(inputValue);
                                            setInteresesError(inputValue < 0.01 || inputValue > 1);
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
                                    {interesesError && <div className="invalid-feedback">El interés debe estar entre 0.01 y 1.</div>}
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Total</label>
                                    <input
                                        type="text"
                                        className={`form-control ${totalError ? 'is-invalid' : ''}`}
                                        placeholder="$"
                                        required
                                        maxLength={9}
                                        onInput={(e) => validarNumericos(e, setTotalError, 8)}
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
                                    {totalError && <div className="invalid-feedback">El total debe tener al menos 8 caracteres.</div>}
                                </div>
                                <br />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <table className="table table-hover mb-5 border" style={{ maxWidth: 800 }}>
                                <thead className="table-secondary">
                                    <tr>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Precio Base</th>
                                        <th scope="col">Precio Venta</th>
                                        {/* <th scope="col" style={{ textAlign: 'center' }}>Acciones</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProductos.map((producto, index) => (
                                        <tr key={index}>
                                            <td>{producto}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={`form-control ${cantidadError[index] ? 'is-invalid' : ''}`}
                                                    placeholder="Cantidad"
                                                    required
                                                    maxLength={2}
                                                    onKeyDown={(e) => validarNumericos(e, (isValid) => {
                                                        const nuevosErrores = [...cantidadError];
                                                        nuevosErrores[index] = !isValid || e.target.value.length === 0;
                                                        setCantidadError(nuevosErrores);
                                                    }, 1)}
                                                    value={cantidad[index] || ''}
                                                    onChange={(e) => {
                                                        const nuevosValores = [...cantidad];
                                                        nuevosValores[index] = e.target.value;
                                                        setCantidad(nuevosValores);

                                                        // Aquí aplicamos la validación para actualizar el estado de error
                                                        const nuevosErrores = [...cantidadError];
                                                        nuevosErrores[index] = e.target.value.length === 0 || parseFloat(e.target.value) <= 0;
                                                        setCantidadError(nuevosErrores);
                                                    }}
                                                />
                                                {cantidadError[index] && <div className="invalid-feedback">La cantidad debe ser mayor a 0.</div>}
                                            </td>
                                            <td>
                                                {Array.isArray(precioBase) ? (
                                                    <div>
                                                        $ {parseFloat(precioBase[index]).toLocaleString('es-CO')}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        $ {parseFloat(precioBase).toLocaleString('es-CO')}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${precioVentaError[index] ? 'is-invalid' : ''}`}
                                                        placeholder="$"
                                                        required
                                                        maxLength={9}
                                                        value={Array.isArray(precioVenta) ? precioVenta[index] : precioVenta}
                                                        onChange={(e) => {
                                                            const updatedPrecioVenta = [...precioVenta];
                                                            updatedPrecioVenta[index] = e.target.value;
                                                            setPrecioVenta(updatedPrecioVenta);

                                                            const nuevosErrores = [...precioVentaError];
                                                            nuevosErrores[index] = e.target.value.length < 8;
                                                            setPrecioVentaError(nuevosErrores);
                                                        }}
                                                    />
                                                    {precioVentaError[index] && <div className="invalid-feedback">El precio de venta debe tener al menos 8 caracteres.</div>}
                                                </td>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones ms-sm-0 w-100 d-flex justify-content-center">
                                    <button type="button" className="btn btn-dark btn-styles" onClick={actualizarNegociacion}>Guardar</button>
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

            <Pie></Pie>

        </>
    );
};

export default EditarNegociacion;