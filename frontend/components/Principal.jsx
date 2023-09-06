import React from 'react'

const Principal = () => {
    return (
        <>
            {/* <div>Principal</div> */}

            <main className="d-flex   flex-column  border border-primary m-3 rounded">

                <h3 className="text-center  py-0 pt-3 my-0">CREAR PRODUCTO 22</h3>

                <div className="controles d-flex align-items-center">
                    <i className="icon-menu fa-solid fa-angles-left"> volver </i>
                </div>

                <form className="formulario"  >

                    <div className="contenedores d-flex justify-content-center flex-lg-row flex-column  flex-sm-column mx-5 gap-5">
                        <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100 ">
                            <div className="mb-3 w-100">
                                <label htmlFor="codigo" className="form-label fw-bold">Código</label>
                                <input type="text" className="form-control" id="codigo" aria-describedby="emailHelp" placeholder="Código" required />
                            </div>

                            <div className="mb-3 w-100">
                                <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                                <input type="text" className="form-control" id="nombre" aria-describedby="emailHelp" placeholder="Nombre" required />
                            </div>

                            <div className="mb-3 w-100">
                                <label htmlFor="descripcion" className="form-label fw-bold">Descripción</label>
                                <input type="text" className="form-control" id="descripcion" aria-describedby="emailHelp" placeholder="Descripción" required />
                            </div>
                        </div>

                        <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0  w-100 ">
                            <div className="mb-3 w-100">
                                <label htmlFor="imagen" className="form-label fw-bold">Estado</label>
                                <select className="form-select" aria-label="Default select example">
                                    <option defaultValue>-- Seleccione una opción --</option>
                                    <option value="1">Activo</option>
                                    <option value="2">Inactivo</option>
                                    <option value="3">Three</option>
                                </select>

                            </div>
                            <div className="mb-3 w-100">
                                <label htmlFor="imagen" className="form-label fw-bold">Imagen</label>
                                <input type="file" className="form-control" id="imagen" placeholder="Imagen" required />
                            </div>

                            <div className="mb-3 w-100">
                                <label htmlFor="precio" className="form-label fw-bold">Precio</label>
                                <input type="number" className="form-control" id="precio" aria-describedby="emailHelp" placeholder="Precio" required />
                            </div>
                        </div>
                    </div>


                    <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5 ">
                        <div className="d-flex justify-content-center  w-100">
                            <div className="div_botones ms-sm-0  w-100">
                                <button type="submit" className="btn btn-dark w-100 btn-styles">Enviar</button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center w-100">
                            <div className="div_botones  me-sm-0  w-100">
                                <button type="reset" className="btn btn-dark w-100 btn-styles">Limpiar</button>
                            </div>
                        </div>
                    </div>
                </form>



            </main>
        </>
    )
}

export default Principal
