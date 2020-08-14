const express = require('express')
const conectarDB = require('./config/db')

//crear servidor
const app = express()

//conectar ala base de datos
conectarDB()

//set puerto
const PORT = process.env.PORT || 4000

//set pagina principal
app.get('/', (req, res)=>{
    res.send('hola mundo')
})

//start app
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})