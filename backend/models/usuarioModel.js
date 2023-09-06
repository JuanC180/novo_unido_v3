const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const generarId = require('../helpers/generarId.js');


/*
  email
  clave
  estado
  nombre
 
*/

const usuarioSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 60,
    trim: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 20,
    trim: true
  },
  nombre:{
    type: String,
    required: true,
    max: 60,
    trim: true
  },
  apellido:{
    type: String,
    required: true,
    max: 60,
    trim: true
  },
  estado: {
    type: String,
    default: 'Activo',
    trim: true
  },
  rol: {
    type: String,
    default: 'Administador',
    trim: true
  },
  token: {
    type: String,
    default: generarId(),
},
confirmado:{
    type: Boolean,
    default: false
}
},
  {
    timestamps: true
  }
);

usuarioSchema.pre('save', async function(next){
  if(!this.isModified('password')){
      next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario){
  return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;