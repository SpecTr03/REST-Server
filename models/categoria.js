const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
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
  //Aqui guardamos quien fue el usuario que creo la categoria
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

//Debe ser una funcion no flecha(normal) para manipular el this
CategoriaSchema.methods.toJSON = function() {
    //quitanto version del json __v para mas seguridad
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model("Categoria", CategoriaSchema);
