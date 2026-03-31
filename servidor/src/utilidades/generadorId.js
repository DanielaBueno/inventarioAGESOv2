// ============================================================
// GENERADOR DE IDs ÚNICOS
// generadorId.js
// ============================================================

const { v4: uuidv4 } = require('uuid');

/**
 * Genera un ID único con un prefijo legible.
 * Ejemplo: generarId('OBJ') → 'OBJ_a1b2c3d4...'
 */
const generarId = (prefijo = 'ID') => {
  return `${prefijo}_${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
};

module.exports = { generarId };
