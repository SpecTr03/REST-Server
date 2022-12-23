const { Router } = require("express");
//Paquete para validar el email enviado en el body
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { login, googleSignIn } = require("../controllers/auth");

const router = new Router();

//Endpoint POST
router.post("/login",[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos
], login);

//Endpoint POST
router.post("/google",[
    check('id_token', 'id_token de google es necesario').notEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;
