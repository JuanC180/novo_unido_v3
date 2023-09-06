
const correo = document.querySelector('#correo');
const password = document.querySelector('#password');

const formulario = document.querySelector('#formulario');
console.log(formulario)
const contendorFormulario = document.querySelector('.contenedor-formulario');

formulario.addEventListener('submit', validarDatos);

// function validarDatos(e){
// 	e.preventDefault();
	
// 	if(correo.value === '' || password.value === ''){
// 		const divMensaje = document.createElement('p');
// 		divMensaje.textContent = 'Todos los campos son obligatorios';
// 		divMensaje.classList.add('mensaje');

// 		correo.classList.add('error')
// 		password.classList.add('error')

// 		contendorFormulario.appendChild(divMensaje);

// 		setTimeout(() =>{
// 			const mensaje = document.querySelector('#mensaje')
// 			// mensaje.classList.contains()
// 			// if(mensaje){

// 			// }
// 			contendorFormulario.removeChild(divMensaje)
// 		}, 3000)
// 	}else{
// 		correo.classList.remove('error');
// 		password.classList.remove('error');
// 		alert("Login success")
// 	}
// }
