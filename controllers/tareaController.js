const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

//crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //extrar proyecto y comprobar si existe
    try {
        const { proyecto } = req.body

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) {
            return res.status(404).json({msg:'proyecto no encontrado'})
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'no autorizado'})

        //creamos la tarea
        const tarea = await new Tarea(req.body)
        await tarea.save()
        res.json(tarea)

    }catch(error){
        console.log(error)
        res.status(500).send('hubo un error')
    }
}

exports.obtenerTareas = async(req, res)=>{
    try{
        const { proyecto } = req.body

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) {
            return res.status(404).json({msg:'proyecto no encontrado'})
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) return res.status(401).json({msg:'no autorizado'})

        //filtramos las tareas
        const tareas = await Tarea.find({proyecto})
        res.json({ tareas })

    }catch(error){
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}