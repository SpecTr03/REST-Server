const { Categoria, Producto } = require('../models');
const Rol = require('../models/rol');
const Usuario = require('../models/user');

const esRolValido = async(rol='') => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
      throw new Error(`El Rol ${ rol } no esta registrado en la BD`);
    }
  }

//Verificar si el correo ya existe en la BD
const verificarEmailDuplicado = async(correo = '') => {

    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error (`El correo: ${correo}  ya esta registrado`);
    }
}

//Verificar si existe el usuario con el id enviado en la BD
const existeUsuarioPorId = async(id) => {

    const existeID = await Usuario.findById(id);
    if (!existeID) {
        throw new Error (`El usuario con id: ${id}  no se encuentra en la BD`);
    }
}

//Verificar si existe la categoria con el id enviado en la BD
const existeCategoriaPorId = async(id) => {

  const existeID = await Categoria.findById(id);
  if (!existeID) {
      throw new Error (`La categoria con id: ${id}  no se encuentra en la BD`);
  }
}

//Verificar si existe el producto con el id enviado en la BD
const existeProductoPorId = async(id) => {

  const existeID = await Producto.findById(id);
  if (!existeID) {
      throw new Error (`El producto con id: ${id}  no se encuentra en la BD`);
  }
}

//Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
  const incluida = colecciones.includes(coleccion)
  if (!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida, colecciones permitidas: ${colecciones}`)
  }
  return true;
}


  module.exports = {
    esRolValido,
    verificarEmailDuplicado,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
  }