require('dotenv').config();
const Server = require('./models/server');


const server = new Server();
//Levantando el servidor
server.listen();
