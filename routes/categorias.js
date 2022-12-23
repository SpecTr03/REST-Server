const { Router } = require("express");
//Paquete para validar el email enviado en el body
const { check } = require("express-validator");
const {
  crearCategoria,
  categoriasGet,
  categoriaGetId,
  categoriaPut,
  categoriaDelete,
} = require("../controllers/categorias");

const { existeCategoriaPorId } = require("../helpers/db-validators");
const { tieneRol } = require("../middlewares");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = new Router();

//Obtener todas las categorias - publico
router.get("/", categoriasGet);

//Obtener una categoria por ID - publico
router.get(
  "/:id",
  [
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeCategoriaPorId),

    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  categoriaGetId
);

//Crear categoria - privado (cualquier persona con un token valido)
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar un registro por ID - privado (cualquier persona con un token valido)
router.put(
  "/:id",
  [
    validarJWT,
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeCategoriaPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),

    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  categoriaPut
);

//Borrar una categoria - Admin
router.delete("/:id", [
    validarJWT,
    // esAdminRol,
    tieneRol("ADMIN_ROL"),
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeCategoriaPorId),
    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
],
    categoriaDelete
);

module.exports = router;
