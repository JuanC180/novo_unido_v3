import React from 'react'

const Pie = () => {
  const fecha = new Date();

  return (
    <>
      <footer className="main__footer d-flex justify-content-between  py-3">
        <div className="ms-5 texto-footer">
          <strong className='texto-footer'>Copyright © 2014 - {fecha.getFullYear()} <a className='texto-footer' href="https://www.novomatic.com">Novamatic</a>.</strong> All rights reserved.
        </div>

        <div className="float-right d-none d-sm-block me-5 texto-footer">
          <b className='texto-footer'>Versión</b> 3.7.4
        </div>
      </footer>
    </>
  )
}

export default Pie