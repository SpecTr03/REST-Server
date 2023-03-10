const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (files , extensionesValidas = ["png", "jpg", "jpeg", "git"], carpeta = '') => {

  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    //Acceder a la ultima posicion del arreglo cortado por el split.
    const extension = nombreCortado[nombreCortado.length - 1];

    //Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(`La extension ${extension} no es permitida, solo se admiten: ${extensionesValidas}`,)
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta ,nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
