const express = require('express')
//const bodyParser = require('body-parser')
const conectarDB = require('./config/db')

//crear servidor
const app = express()

//conectar ala base de datos
conectarDB()

//habiliar json
/* app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) */
app.use(express.json({ extended:true }))

//set puerto
const PORT = process.env.PORT || 4000

//set pagina principal
app.get('/', (req, res)=>{
    res.send('hola mundo')
})

/* app.post('/api/product', (req, res) => {
    console.log(req.body)
    res.status(200).send({ message: 'recibido bro!' })
})  */

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))

//start app
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})