const { Router } = require("express");
//Paquete para validar el email enviado en el body
const { check } = require("express-validator");
const {
  esRolValido,
  verificarEmailDuplicado,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/user");

// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRol, tieneRol } = require("../middlewares/validar-roles");
const {
  validarCampos,
  validarJWT,
  esAdminRol,
  tieneRol,
} = require("../middlewares");

const router = new Router();

//Endpoint GET
router.get("/", usuariosGet);

//Endpoint POST
//Validacion de campos
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio y mas de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(verificarEmailDuplicado),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),

    //Checkeando el rol con una coleccion de mongoDB
    check("rol").custom(esRolValido), //Lo que mandamos por parametro es igual a: (rol) => esRolValido(rol)

    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  usuariosPost
);

//Endpoint PUT
//Pasando un parametro por url con la palabra :id
router.put(
  "/:id",
  [
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeUsuarioPorId),
    //Checkeando el rol con una coleccion de mongoDB
    check("rol").custom(esRolValido), //Lo que mandamos por parametro es igual a: (rol) => esRolValido(rol)

    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  usuariosPut
);

//Endpoint PATCH
router.patch("/", usuariosPatch);

//Endpoint DELETE
router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRol,
    tieneRol("ADMIN_ROL", "VENTAS_ROL"),
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeUsuarioPorId),
    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
