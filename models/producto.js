const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  //Aqui guardamos quien fue el usuario que creo el Producto
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  precio: {
    type: Number,
    default: 0
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  descripcion: {type: String},
  disponible: {type: Boolean, default: true},
  img: {type: String}
});

//Debe ser una funcion no flecha(normal) para manipular el this
ProductoSchema.methods.toJSON = function() {
    //quitanto version del json __v para mas seguridad
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model("Producto", ProductoSchema);
