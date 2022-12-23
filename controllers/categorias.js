const { response } = require("express");
const { Categoria }  = require('../models');

//Obtener categorias - paginado - total - populate
const categoriasGet = async (req, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;

    const query = {estado: true};

    const [total, categorias] = await Promise.all([

        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
    ]);

    res.json({
        categorias,
        total
    });
}


//obtenerCategoria - populate {}
const categoriaGetId = async (req, res = response) => {
    //Recibiendo parametros de la url
    const {id} = req.params;
  
    const categoria = await Categoria.findById(id)
    .populate('usuario', 'nombre');
  
    res.json({
      id,
      categoria
    });
  };


const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe.`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

//Actualizar categoria
const categoriaPut = async (req, res = response) => {
    //Recibiendo parametros de la url
    const {id} = req.params;
    //Excluyendo _id (id de mongo) del body completo.
    //Es decir, el usuario no puede actualizar campos como _id, usuario y estado de la bd, solamente el nombre 
    const { _id, estado, usuario, ...data } = req.body;
  
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //{new: true} Para que la respuesta del json este actualizada con los nuevos datos que se mandaron.
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
  
    res.json({
      categoria
    });
  };


//borrarCategoria (borrado logico)
const categoriaDelete = async(req, res = response) => {

    const {id} = req.params;
  
    //Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);
  
    //Cambiar su estado a false (borrado logico?)
    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false}, {new:true});
    const usuarioAutenticado = req.usuario;
  
    res.json({categoria, usuarioAutenticado});
  };


module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGetId,
    categoriaPut,
    categoriaDelete
}