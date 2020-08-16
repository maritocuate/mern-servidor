const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    //check errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

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

        //init JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //sign JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1hr
        }, (error, token)=>{
            if(error) throw error

            //msg confirm
            res.json({token})
        })
    }catch(error){
        console.log(error)
        res.status(400).send('hubo un error')
    }
}