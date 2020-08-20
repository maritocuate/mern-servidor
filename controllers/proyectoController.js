const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try{
        //Crear proyecto
        const proyecto = new Proyecto(req.body)
        
        //guardar el creador via jwt
        proyecto.creador = req.usuario.id

        //guardar proyecto
        proyecto.save()
        res.json(proyecto)
        
    }catch(error){
        console.log(error)
        res.status(500).send('hubo un error')
    }
}

//obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try{
        const proyectos = await Proyecto.find({ creador: req.usuario.id })
        res.json({ proyectos })
    }catch(error){
        console.log(error)
        res.status(500).send('hubo un error')
    }
}

