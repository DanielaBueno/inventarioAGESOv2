// ============================================================
// VALIDADORES REUTILIZABLES
// validadores.js
// ============================================================

const { CATEGORIAS, ESTADOS_OBJETO, ESTADOS_FISICOS, RESULTADOS_CALIBRACION } = require('../configuracion/configuracion');

/**
 * Valida que un campo de texto no esté vacío.
 */
const requerido = (valor, nombreCampo) => {
  if (!valor || String(valor).trim() === '') {
    return `El campo "${nombreCampo}" es obligatorio`;
  }
  return null;
};

/**
 * Valida que un valor esté dentro de una lista permitida.
 */
const estaEnLista = (valor, lista, nombreCampo) => {
  if (!lista.includes(valor)) {
    return `El campo "${nombreCampo}" tiene un valor no permitido: "${valor}"`;
  }
  return null;
};

/**
 * Valida los datos de un ObjetoInventario.
 * Devuelve un array de errores (vacío si todo es válido).
 */
const validarObjetoInventario = (datos) => {
  const errores = [];

  const camposRequeridos = [
    ['nombre',           'Nombre'],
    ['codigoInventario', 'Código de inventario'],
    ['categoria',        'Categoría'],
    ['ubicacionActual',  'Ubicación actual'],
  ];

  camposRequeridos.forEach(([campo, etiqueta]) => {
    const error = requerido(datos[campo], etiqueta);
    if (error) errores.push(error);
  });

  if (datos.categoria) {
    const error = estaEnLista(datos.categoria, CATEGORIAS, 'Categoría');
    if (error) errores.push(error);
  }

  if (datos.estado) {
    const error = estaEnLista(datos.estado, ESTADOS_OBJETO, 'Estado');
    if (error) errores.push(error);
  }

  const cantidad = Number(datos.cantidadEtiquetas);
  if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
    errores.push('La cantidad de etiquetas debe ser un número entre 1 y 10');
  }

  return errores;
};

/**
 * Valida los datos de un Traslado.
 */
const validarTraslado = (datos) => {
  const errores = [];

  ['idObjeto', 'ubicacionDestino', 'personaResponsable'].forEach((campo) => {
    const error = requerido(datos[campo], campo);
    if (error) errores.push(error);
  });

  if (datos.ubicacionOrigen && datos.ubicacionOrigen === datos.ubicacionDestino) {
    errores.push('La ubicación de destino debe ser diferente a la de origen');
  }

  return errores;
};

/**
 * Valida los datos de una Calibración.
 */
const validarCalibracion = (datos) => {
  const errores = [];

  ['idObjeto', 'fechaCalibracion'].forEach((campo) => {
    const error = requerido(datos[campo], campo);
    if (error) errores.push(error);
  });

  if (datos.resultado) {
    const error = estaEnLista(datos.resultado, RESULTADOS_CALIBRACION, 'Resultado');
    if (error) errores.push(error);
  }

  return errores;
};

/**
 * Valida los datos de un ItemChecklist.
 */
const validarItemChecklist = (datos) => {
  const errores = [];

  ['idObjeto'].forEach((campo) => {
    const error = requerido(datos[campo], campo);
    if (error) errores.push(error);
  });

  if (datos.estadoFisico) {
    const error = estaEnLista(datos.estadoFisico, ESTADOS_FISICOS, 'Estado físico');
    if (error) errores.push(error);
  }

  return errores;
};

module.exports = {
  validarObjetoInventario,
  validarTraslado,
  validarCalibracion,
  validarItemChecklist,
};
