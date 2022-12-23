const {Router} = require('express');
const {buscar} = require('../controllers/buscar');

const router = new Router();

//Ruta para obtener a atraves de los parametros, la coleccion de bd, y el nombre de lo que busca(termino)
router.get('/:coleccion/:termino', buscar)


module.exports = router;