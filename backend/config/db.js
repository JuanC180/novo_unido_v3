const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://jfcorrales:Nacional123@cluster0.t1go3bw.mongodb.net/novo_proyecto1')

const bd = mongoose.connection

bd.on('connected', ()=>{console.log('Conexión exitosa a MongoDb')})
bd.on('error', ()=>{console.log('Error en la conexión a MongoDb')})

module.exports = mongoose