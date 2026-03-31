// ============================================================
// CONFIGURACIÓN GLOBAL DEL SISTEMA
// configuracion.js - Variables centralizadas
// ============================================================

const path = require('path');

const CONFIGURACION = {
  PUERTO:            process.env.PUERTO || 3000,
  ENTORNO:           process.env.ENTORNO || 'desarrollo',
  VERSION:           '2.0.0',
  ORIGEN_FRONTEND:   'http://localhost:5173',
  DIRECTORIO_DATOS:  path.join(__dirname, '../../datos'),
  DIRECTORIO_TEMP:   path.join(__dirname, '../../temp'),
};

const CATEGORIAS = [
  'Equipos Médicos',
  'Equipos de Oficina',
  'Accesorios',
  'Equipos de Emergencia',
  'Cafetería',
  'Herramientas',
  'Archivo',
  'Consumibles',
];

const ESTADOS_OBJETO = ['Disponible', 'En uso', 'En reparación', 'Dado de baja'];

const ESTADOS_CALIBRACION = ['Calibrado', 'Vencido', 'Pendiente', 'Próximo a Vencer', 'No Aplica'];

const ESTADOS_FISICOS = ['Bueno', 'Regular', 'Malo'];

const RESULTADOS_CALIBRACION = ['Aprobado', 'No Aprobado', 'Condicional'];

module.exports = {
  CONFIGURACION,
  CATEGORIAS,
  ESTADOS_OBJETO,
  ESTADOS_CALIBRACION,
  ESTADOS_FISICOS,
  RESULTADOS_CALIBRACION,
};
