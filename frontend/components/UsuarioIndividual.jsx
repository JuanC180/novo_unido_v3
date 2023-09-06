import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaToggleOn } from 'react-icons/fa';

const UsuarioIndividual = ({ usuario }) => {
    const { _id } = usuario; // Obtén el _id del objeto cliente
    const { id } = useParams();
    const [isActivated, setIsActivated] = useState(false);
    const [estado, setEstado] = useState(usuario.estado);

    const navegar = useNavigate()
    function eliminarUsuario() {
        swal({
            title: "Eliminar",
            text: "¿Estás seguro de eliminar el registro?",
            icon: "warning",
            buttons: {
                cancel: "NO",
                confirm: "SI"
            },
            dangerMode: true
        }).then(isConfirmed => {
            if (isConfirmed) {
                const url = `usuarios/eliminar-usuario/${_id}`;
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {  // Corrección en la ruta
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        swal({
                            title: "Usuario eliminado con éxito",
                            icon: "success"
                        }).then(() => {
                            navegar(0);
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                alert(data.message); // Mostrar el mensaje específico del objeto
                navegar(0);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        setIsActivated(estado === 'Activo');
    }, [estado]);

    const toggleActivation = () => {
        setIsActivated(!isActivated);

        const newEstado = estado === 'Activo' ? 'Inactivo' : 'Activo';
        setEstado(newEstado);

        // Envía la solicitud al servidor para actualizar el estado en la base de datos
        const url = `usuarios/actualizar-estado/${_id}`;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: newEstado })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                swal({
                    title: "Estado modificado correctamente",
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
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch(error => {
                console.error('Error:', error);
                swal({
                    title: "Error",
                    text: "Ha ocurrido un error al modificar el estado del usuario.",
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
            });
    };

    if (!usuario) {
        return <> <div>No se ha proporcionado un usuario válido</div></>
    }
    return (
        <tr>
            <td>{usuario.nombre}</td>
            <td>{usuario.apellido}</td>
            <td>{usuario.email}</td>
            <td style={{ textAlign: 'center' }}>
                <Link onClick={toggleActivation}>
                    <FaToggleOn
                        title="Activar-Desactivar"
                        style={{
                            marginRight: 10,
                            color: isActivated ? 'green' : 'gray', // Cambia el color según el estado
                            fontSize: 30,
                            transition: 'transform 0.2s ease', // Agrega una transición suave al giro
                            transform: isActivated ? 'rotateY(180deg)' : 'rotateY(0deg)', // Aplica el giro horizontal según el estado
                        }}
                    />
                </Link>

                {/* <Link to={`/admin/editar-usuario/${usuario._id}`}>
                    <i className="fa fa-pencil" title="Editar" style={{ marginRight: 10, color: '#212529', fontSize: 22 }} />
                </Link> */}
                <Link to={`/admin/editar-usuario/${usuario._id}`}>
                    <i
                        className="fa fa-pencil"
                        title="Editar"
                        style={{
                            marginRight: 10,
                            color: usuario.estado === 'Activo' ? '#212529' : 'gray',
                            fontSize: 22,
                            cursor: usuario.estado === 'Activo' ? 'pointer' : 'not-allowed',
                        }}
                        onClick={event => {
                            if (usuario.estado !== 'Activo') {
                                event.preventDefault();
                                swal({
                                    title: "Usuario inactivo",
                                    text: "No se puede editar un usuario inactivo.",
                                    icon: "warning",
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
                        }}
                    />
                </Link>

                {/* <Link onClick={eliminarUsuario}>
                    <i className="fa fa-trash" title="Eliminar" style={{ marginRight: 10, color: '#dc3545', fontSize: 22 }} />
                </Link> */}

            </td>
        </tr>
    )
}


export default UsuarioIndividual;