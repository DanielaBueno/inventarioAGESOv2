// ============================================================
// RUTAS DE TRASLADOS
// rutas/rutasTraslados.js
// ============================================================
const { Router } = require('express');
const { controladorTraslados } = require('../controladores/index');

const rutasTraslados = Router();

rutasTraslados.get('/',                          controladorTraslados.listar);
rutasTraslados.get('/objeto/:idObjeto',           controladorTraslados.historialObjeto);
rutasTraslados.post('/',                          controladorTraslados.registrar);

module.exports = rutasTraslados;
