// ============================================================
// RUTAS DE INVENTARIO
// rutas/rutasInventario.js
// ============================================================
const { Router } = require('express');
const { controladorInventario } = require('../controladores/index');

const rutasInventario = Router();

rutasInventario.get('/',                controladorInventario.listar);
rutasInventario.get('/buscar',          controladorInventario.buscar);
rutasInventario.get('/estadisticas',    controladorInventario.estadisticas);
rutasInventario.get('/:id',             controladorInventario.obtenerUno);
rutasInventario.post('/',               controladorInventario.crear);
rutasInventario.put('/:id',             controladorInventario.actualizar);
rutasInventario.delete('/:id',          controladorInventario.eliminar);

module.exports = rutasInventario;
