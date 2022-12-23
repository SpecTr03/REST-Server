const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        mongoose.connect( process.env.MONGODB_ATLAS);
        console.log("base de datos online");
        
    } catch (error) {
        console.log(error);
        throw new Error('Error conexion base de datos');
    }

};

module.exports = {
    dbConnection
}