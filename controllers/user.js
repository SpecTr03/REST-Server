const { response } = require("express");
//Paquete encriptacion de password
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/user");

//Controladores, seccion donde se maneja la logica de nuestras APIS

const usuariosGet = async (req, res = response) => {
  //Recibiendo un query en la url
  //Ejemplo de URL: http://localhost:8080/api/users?apellido1=cifuentes&apellido2=florez
  const { limite = 5, desde = 0 } = req.query;
  //Filtrar y mostrar solo a los usuarios que tengan true en el estado(activos)
  const query = { estado: true };
  //Tambien se puede aplicar la desestructuracion
  //const { apellido1 } = req.query;

  // const usuarios = await Usuario.find(query)
  //   //Desde: indica el numero donde debe empezar a recorrer el arreglo de usuarios
  //   .skip(Number(desde))
  //   //Limite: indica el numero max de arreglos que se deben mostrar
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments(query);

  /**
   * Optimizando la ejecucion del codigo con respecto a el codigo anterior(lineas 18-24)
   * Esto quiere decir que la consulta se ejecutara en menos tiempo
   */
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      //Desde: indica el numero donde debe empezar a recorrer el arreglo de usuarios
      .skip(Number(desde))
      //Limite: indica el numero max de arreglos que se deben mostrar
      .limit(Number(limite)),
  ]);

  res.json({
    usuarios,
    total
    // query,
  });
};

const usuariosPost = async (req, res = response) => {
  //recibiendo el body de la peticion
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  //Recibiendo parametros de la url
  const {id} = req.params;
  //Excluyendo _id (id de mongo), password, google y correo del body completo
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    //Encriptar la password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    id,
    usuario,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch Api controlador",
  });
};

const usuariosDelete = async(req, res = response) => {

  const {id} = req.params;

  //Borrado fisico
  // const usuario = await Usuario.findByIdAndDelete(id);

  //Cambiar su estado a false (borrado logico?)
  const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});
  const usuarioAutenticado = req.usuario;

  res.json({usuario, usuarioAutenticado});
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
