const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {

    //check errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //extraer el email y password
    const { email, password } = req.body

    try{
        //1. revisar que sea un usuario registrado
        let usuario  = await Usuario.findOne({email})
        if(!usuario){
            return res.status(400).json({ msg:'El usuario NO existe' })
        }

        //2. check password
        const passCorrecto = await bcrypt.compare(password, usuario.password)
        if(!passCorrecto){
            return res.status(400).json({msg:'el password no es correcto'})
        }

        //3. si todo es correcto crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1hr
        }, (error, token)=>{
            if(error) throw error

            //msg confirm
            res.json({token})
        })

    }catch(error){
        console.log(error)
    }
}