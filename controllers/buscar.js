const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = ["usuarios", "categoria", "productos"];

const buscarUsuarios = async (termino = "", res = response) => {
  //Recibiendo el termino mandado por parametro y verificando si es un id de mongo
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino, {estado: true});
    return res.json({
        results: (usuario)? [usuario] : []
    });
  }

  //Expresion regular para hacer que la busqueda sea insensible a mayus y minus
  const regex = new RegExp(termino, 'i');

  //Buscando usuarios por nombre
  const usuarios = await Usuario.find({
    //Buscando por nombre o ($or) por correo
    $or: [{nombre: regex}, {correo: regex}],
    //Y el estado debe de ser = true
    $and: [{estado: true}]
  });

  res.json({
    results: usuarios
});

};

const buscarCategoria = async (termino = "", res = response) => {
  //Recibiendo el termino mandado por parametro y verificando si es un id de mongo
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino , {estado: true});
    return res.json({
        results: (categoria)? [categoria] : []
    });
  }

  //Expresion regular para hacer que la busqueda sea insensible a mayus y minus
  const regex = new RegExp(termino, 'i');

  //Buscando categorias por nombre
  const categorias = await Categoria.find({
    //buscando por nombre y el estado debe de ser = true
    nombre: regex, estado: true
  });

  res.json({
    results: categorias
});

};

const buscarProductos = async (termino = "", res = response) => {
  //Recibiendo el termino mandado por parametro y verificando si es un id de mongo
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const producto = await Producto.findById(termino, {estado: true});
    return res.json({
        results: (producto)? [producto] : []
    });
  }

  //Expresion regular para hacer que la busqueda sea insensible a mayus y minus
  const regex = new RegExp(termino, 'i');

  //Buscando categorias por nombre
  const producto = await Producto.find({
    //buscando por nombre y el estado debe de ser = true
    nombre: regex, estado: true
  });

  res.json({
    results: producto
});

};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: "Las colecciones permitidas son: " + coleccionesPermitidas
    });
  }

  switch (coleccion) {
    case "usuarios":
        buscarUsuarios(termino, res)
      
      break;
    case "categoria":
      buscarCategoria(termino, res);

      break;
    case "productos":
      buscarProductos(termino, res);

      break;
    default:
        res.status(500).json({
            msg: "Se olvido hacer la busqueda",
          });
    
  }
  
};

module.exports = {
  buscar,
  buscarUsuarios
};
