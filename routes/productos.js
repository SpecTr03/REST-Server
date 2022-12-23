const { Router } = require("express");
//Paquete para validar el email enviado en el body
const { check } = require("express-validator");

const {
    crearProducto, 
    productosGet,
    productoGetId,
    productoPut,
    productoDelete
} = require('../controllers/productos');

const { existeProductoPorId } = require("../helpers/db-validators");
const { tieneRol } = require("../middlewares");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = new Router();


//Obtener todos los productos - publico
router.get("/", productosGet);

//Obtener un producto por ID - publico
router.get(
  "/:id",
  [
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeProductoPorId),

    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  productoGetId
);

//Crear producto - privado (cualquier persona con un token valido)
router.post(
    "/",
    [
      validarJWT,
      check("nombre", "El nombre es obligatorio").not().isEmpty(),
      check("descripcion", "La descripcion es obligatorio").not().isEmpty(),
      check("categoria", "La categoria es obligatoria").not().isEmpty(),
      validarCampos,
    ],
    crearProducto
  );

//Actualizar un registro por ID - privado (cualquier persona con un token valido)
router.put(
  "/:id",
  [
    validarJWT,
    //Validando que el id enviado sea de MONGODB.
    check("id", "No es un ID valido").isMongoId(),
    //Validando que el id exista en la bd
    check("id").custom(existeProductoPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),

    //Llamando nuestro middleware para que se ejecute.
    validarCampos,
  ],
  productoPut
);

//Borrar una categoria - Admin
router.delete("/:id", [
  validarJWT,
  // esAdminRol,
  tieneRol("ADMIN_ROL"),
  //Validando que el id enviado sea de MONGODB.
  check("id", "No es un ID valido").isMongoId(),
  //Validando que el id exista en la bd
  check("id").custom(existeProductoPorId),
  //Llamando nuestro middleware para que se ejecute.
  validarCampos,
],
  productoDelete
);

  module.exports = router;