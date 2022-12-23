const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRols = require("../middlewares/validar-roles");

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRols
}