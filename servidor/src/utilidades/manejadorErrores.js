// ============================================================
// MANEJADOR GLOBAL DE ERRORES
// manejadorErrores.js
//
// Express permite definir un middleware de 4 parámetros (err, req, res, next)
// para capturar cualquier error no controlado en la aplicación.
// ============================================================

/**
 * Middleware para rutas que no existen (404)
 */
const rutaNoEncontrada = (req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
    datos: null,
  });
};

/**
 * Middleware global de errores — DEBE tener 4 parámetros para que Express lo reconozca.
 * Se registra AL FINAL de todas las rutas en app.js.
 */
// eslint-disable-next-line no-unused-vars
const manejadorErroresGlobal = (error, req, res, next) => {
  console.error('❌ Error no controlado:', error.message);

  const codigoEstado = error.statusCode || 500;
  const mensaje = error.message || 'Error interno del servidor';

  res.status(codigoEstado).json({ exito: false, mensaje, datos: null });
};

module.exports = { rutaNoEncontrada, manejadorErroresGlobal };
