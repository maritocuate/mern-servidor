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

//actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //extraer la informacion 
    const {nombre} = req.body
    const nuevoProyecto = {}
    nombre ? nuevoProyecto.nombre = nombre : null

    try{
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id)

        //chequear si el proyecto existe
        if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'no autorizado'})

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id:req.params.id}, {$set:nuevoProyecto}, {new:true})

        res.json({msg:'proyecto actualizado correctamente!'})

    }catch(error){
        console.log(error)
        res.status(500).send('hubo un error')
    }
}

//elimina un proyecto
exports.eliminarProyecto = async (req, res) => {
    try{
        //1. revisar el ID
        let proyecto = await Proyecto.findById(req.params.id)

        //2. chequear si el proyecto existe
        if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})

        //3. verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'no autorizado'})

        //4. eliminar
        await Proyecto.findByIdAndRemove({ _id:req.params.id })
        res.json({msg:'proyecto eliminado'})

    }catch(error){
        res.status(500).send('hubo un error')
    }
}