const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/user");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verigicar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos -correo",
      });
    }

    //Si el usuario esta activo en mi BD
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos -estado:false",
      });
    }

    //Verificar password
    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos -password",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador(algo salio mal)",
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        rol: "USER_ROL",
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si el usario no esta activo en la BD
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el adminsitrador, usuario bloqueado",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Todo OK",
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "El token de google no es valido",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
