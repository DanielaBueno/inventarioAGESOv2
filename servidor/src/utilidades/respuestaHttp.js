// ============================================================
// RESPUESTAS HTTP ESTANDARIZADAS
// respuestaHttp.js
//
// Todas las respuestas de la API tienen el mismo formato:
// { exito: boolean, mensaje: string, datos: any }
// Esto facilita el manejo en el frontend.
// ============================================================

/**
 * Respuesta exitosa (200 OK)
 */
const exitoso = (res, datos = null, mensaje = 'Operación exitosa') => {
  return res.status(200).json({ exito: true, mensaje, datos });
};

/**
 * Recurso creado exitosamente (201 Created)
 */
const creado = (res, datos = null, mensaje = 'Recurso creado exitosamente') => {
  return res.status(201).json({ exito: true, mensaje, datos });
};

/**
 * Error de validación del cliente (400 Bad Request)
 */
const solicitudInvalida = (res, mensaje = 'Datos inválidos', errores = []) => {
  return res.status(400).json({ exito: false, mensaje, errores, datos: null });
};

/**
 * Recurso no encontrado (404 Not Found)
 */
const noEncontrado = (res, mensaje = 'Recurso no encontrado') => {
  return res.status(404).json({ exito: false, mensaje, datos: null });
};

/**
 * Error interno del servidor (500 Internal Server Error)
 */
const errorServidor = (res, mensaje = 'Error interno del servidor') => {
  return res.status(500).json({ exito: false, mensaje, datos: null });
};

module.exports = { exitoso, creado, solicitudInvalida, noEncontrado, errorServidor };
