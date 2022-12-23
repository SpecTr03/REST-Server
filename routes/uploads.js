const { Router } = require("express");
//Paquete para validar el email enviado en el body
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const router = new Router();

router.get('/:coleccion/:id', [
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen )

router.post('/',cargarArchivo);

router.put('/:coleccion/:id', [
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

module.exports = router;