

import React, { useEffect } from 'react';
import swal from 'sweetalert';
 
const Alerta = ({ alerta }) => {
  useEffect(() => {
    mostrarAlertaError();
  }, [alerta]);

  const mostrarAlertaError = () => {
    if (alerta.error) {
      swal({
        title: `${alerta.msg}`,
        text: "",
        icon: "warning",
        button: "Aceptar"
      });
    }else{
        swal({
          title: `${alerta.msg}`,
          text: "",
          icon: "warning",
          button: "Aceptar"
      });
    }
  };

  return null;
};

export default Alerta;






// import swal from 'sweetalert';

// const Alerta = ({ alerta }) => {
//     return (
      
//       <div className={`${alerta.error ? 'alert alert-danger' : 'alert alert-success'}`} role="alert">
//         {
//                 swal({
//                   title: "Campos vacíos",
//                   text: "Todos los campos son obligatorios",
//                   icon: "warning",
//                   button: "Aceptar"
//                 })
//         }
//         {/* {alerta.msg} */}
//       </div>
//     )
//   }
  
  
//   export default Alerta
