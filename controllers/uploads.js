const path = require ('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");

//NOTA: 'archivo' se refiere al keyname que se manda en el form-data(postman)

const cargarArchivo = async(req, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg: "No hay archivos en la peticion"});
    return;
  }

  try {
      //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'imgs');
      //Imagenes:
      const nombre = await subirArchivo(req.files, undefined, 'imgs');
      res.json({nombre});
    
  } catch (msg) {
    res.status(400).json({msg});
  }
  
};

const actualizarImagen = async(req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: "No hay archivos en la peticion"});
        return;
      }
    

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar eso'})
            
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //Borrar la imagen guardada en el servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        //Si la imagen existe en nuestro servidor entonces borrela
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    //Actualizando imagen
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();

    res.json(modelo);

}

const actualizarImagenCloudinary = async(req, res = response) => {
    

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar eso'})
            
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        //Extrayendo el id de cloudinary
        const nombre = nombreArr[nombreArr.length-1]
        //Eliminando la extension del archivo para que el id de cloudinary quede puro
        const [public_id] = nombre.split('.');
        //Eliminando la imagen alojada en cloudinary
        cloudinary.uploader.destroy(public_id);
    }

    //Desestructurando el path temporal que nos ofrecen en el body del archivo
    const {tempFilePath} = req.files.archivo
    //secure_url es donde se guarda la imagen en cloudinary
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    modelo.img = secure_url;

    await modelo.save()

    res.json(modelo);

}


const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar eso'})
            
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //Borrar la imagen guardada en el servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        //Si la imagen existe en nuestro servidor entonces borrela
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const defaultImage = path.join(__dirname, '../assets/noImage.jpg');
    res.sendFile(defaultImage);

}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};
