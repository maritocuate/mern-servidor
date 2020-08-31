const express = require('express')
const router = express.Router()
const tareaController = require('../controllers/tareaController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

//Crea tareas
//api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
)

//obtener tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
)

//actualizamos tarea por id
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//eliminamos tarea por id
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router