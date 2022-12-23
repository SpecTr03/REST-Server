const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

//Validamos si hay un JWT en el header
const validarJWT = async(req, res = response, next) => {

    /**
     * Capturando el token
     * El keyname del token enviado por el header debe ser x-token para ser verificado.
     */
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay tokens en la peticion'
        });
    }

    try {

        //Verificando si el token es generado por nosotros(Firma).
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY)

        //leer usuario que corresponde a la uid
        const usuario = await Usuario.findById(uid);

        //Verificar que el usuario exista
        if (!usuario) {
            return res.status(401).json({
                msg:'Token no valido -usuario no existe en la DB'
            })
        }

        //Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Token no valido - usuario con estado: false'
            })
        }

        req.usuario = usuario;
        next();    

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}