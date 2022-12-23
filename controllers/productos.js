const { response } = require("express");
const { Producto } = require("../models");


//Obtener productos - paginado - total - populate
const productosGet = async (req, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;

    const query = {estado: true};

    const [total, productos] = await Promise.all([

        Producto.countDocuments(query),
        Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
    ]);

    res.json({
        productos,
        total
    });
}

//obtenerProducto- populate {}
const productoGetId = async (req, res = response) => {
    //Recibiendo parametros de la url
    const {id} = req.params;

    const query = {estado: true};
  
    const producto = await Producto.findById(id).find(query)
    .populate('categoria', 'nombre');
  
    res.json({
      id,
      producto
    });
  };


//Crear producto - privado (JWT)
const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe.`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

//Actualizar producto
const productoPut = async (req, res = response) => {
    //Recibiendo parametros de la url
    const {id} = req.params;
    //Excluyendo _id (id de mongo) del body completo.
    //Es decir, el usuario no puede actualizar campos como _id, usuario y estado de la bd, solamente el nombre 
    const { _id, estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();      
    }
  
    data.usuario = req.usuario._id;

    //{new: true} Para que la respuesta del json este actualizada con los nuevos datos que se mandaron.
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});
  
    res.json({
      producto
    });
  };

//borrarProducto (borrado logico)
const productoDelete = async(req, res = response) => {

    const {id} = req.params;
  
    //Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);
  
    //Cambiar su estado a false (borrado logico?)
    const producto = await Producto.findByIdAndUpdate(id,{estado:false}, {new:true});
    const usuarioAutenticado = req.usuario;
  
    res.json({producto, usuarioAutenticado});
  };

module.exports = {
    crearProducto,
    productosGet,
    productoGetId,
    productoPut,
    productoDelete
}