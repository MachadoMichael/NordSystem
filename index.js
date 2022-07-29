const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const Ingredientes = require('./models/IngredienteSchema')
const cors = require('cors')

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

let db = mongoose.connection

db.once('open', () => {
    console.log('DB carregado')
})

app.use(express.static(path.join(__dirname, 'build')))

app.use(cors())

app.get('/deslogando', async (req, res) => {
    console.log('deslogando')
    db.close()
    res.send(false)
})

const users = [
    { loginUser: 'NordUser', passwordUser: 'senha' },
    { loginUser: 'Skynet', passwordUser: '123' }
]

app.post('/logandoUsuario', express.json(), async (req, res) => {
    let user = req.body
    const verificacao = users.find(element => element.loginUser === user.loginUser && element.passwordUser === user.passwordUser)
    if (verificacao) {
        res.send(true)
        if (verificacao === users[0]) {
            mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@clustercostcalc.urg3z.mongodb.net/NordSystem`)

        }
        if (verificacao === users[1]) {
            mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@clustercostcalc.urg3z.mongodb.net/Skynet`)

        }
    } else {
        res.send(false)
    }

})

app.get('/lendoIngredientes', async (req, res) => {
    let docs = await Ingredientes.find({})
    res.send(docs)
})

app.post('/addIngrediente', express.json(), async (req, res) => {
    let ingrediente = new Ingredientes(req.body)

    try {
        let doc = await ingrediente.save()
    } catch (error) {
        console.log(error)
    }
    let docs = await Ingredientes.find({})
    res.send(docs)
})

app.delete('/removendoIngrediente', express.json(), async (req, res) => {
    let id = req.body._id

    try {
        await Ingredientes.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
    }
    let docs = await Ingredientes.find({})
    res.send(docs)
})


let atualizandoProdutoSchema = {}
produtoSchema = new mongoose.Schema()
const Produtos = mongoose.model('Produto', produtoSchema)

app.post('/addProduto', express.json(), async (req, res) => {

    Object.keys(req.body).map((item, index) => {
        if (item === 'nome' || item === 'tipo') {
            atualizandoProdutoSchema[item] = 'String'
        } else {
            atualizandoProdutoSchema[item] = 'Number'
        }
    })

    produtoSchema.add(atualizandoProdutoSchema)
    let produto = new Produtos(req.body)

    try {
        let doc = await produto.save()
        res.send(doc)
    } catch (error) {
        console.log(error)
    }
})

app.get('/lendoProdutos', async (req, res) => {
    let docs = await Produtos.find({})
    res.send(docs)
})

app.delete('/removendoProduto', express.json(), async (req, res) => {
    let id = req.body._id
    try {
        await Produtos.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
    }
    let docs = await Produtos.find({})
    res.send(docs)
})

app.listen(process.env.PORT || 3000);