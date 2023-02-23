const {Contenedor} = require('./productos.js')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 8080
const productos = new Contenedor("productos.txt")


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
app.on("error", error => console.log(`Error en servidor ${error}`))


app.get('/',(req, res)=>{
    res.send('<h1 style = "color: red">Bienvenidos</h1>')
})
app.get('/products', async (req, res)=>{
    const totalProductos = await productos.getAll()
    res.send({totalProductos})
})
app.get('/products/:pid', async (req, res)=>{
    //const id = Math.floor(Math.random() * 3);
    const {pid} = req.params;
    const item = await productos.getById(parseInt(pid))
    res.send({item})
}) 