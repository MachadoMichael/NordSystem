const mongoose = require('mongoose')

const ingredienteSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
    custo: Number,
    quantia: Number,
})

module.exports = mongoose.model('Ingredientes', ingredienteSchema)