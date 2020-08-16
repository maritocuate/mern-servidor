const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')

exports.crearUsuario = async (req, res) => {
    //res.status(200).send({ message: 'recibido cat!' })

    const { email, password } = req.body

    try{
        //revisa si el usuario existe
        let usuario  = await Usuario.findOne({email})
        if(usuario){
            return res.status(400).json({ msg:'El usuario ya existe' })
        }

        //crea nuevo usuario
        usuario = new Usuario(req.body)

        //hasheo password
        const salt = await bcrypt.genSalt(10)
        usuario.password = await bcrypt.hash(password, salt)

        //guarda usuario
        await usuario.save()

        //mensaje
        res.json({ msg:'Usuario creado correctamente' })
    }catch(error){
        console.log(error)
        res.status(400).send('hubo un error')
    }
}