// ============================================================
// CONTROLADORES
// controladores/index.js
//
// Los controladores son el punto de contacto entre HTTP y la
// lógica de negocio. Su única responsabilidad:
//   1. Extraer datos del request
//   2. Llamar al servicio correspondiente
//   3. Devolver la respuesta HTTP con el formato estándar
// ============================================================

const http = require('../utilidades/respuestaHttp');
const { ServicioInventario }  = require('../servicios/ServicioInventario');
const { ServicioTraslados, ServicioCalibraciones, ServicioChecklist } = require('../servicios/otrosServicios');
const { ServicioImportExport } = require('../servicios/ServicioImportExport');

// ── Controlador de Inventario ─────────────────────────────────
const controladorInventario = {
  listar(req, res) {
    const objetos = new ServicioInventario().listarObjetos();
    return http.exitoso(res, objetos);
  },

  buscar(req, res) {
    const resultados = new ServicioInventario().buscarObjetos(req.query);
    return http.exitoso(res, resultados);
  },

  obtenerUno(req, res) {
    const objeto = new ServicioInventario().obtenerObjeto(req.params.id);
    if (!objeto) return http.noEncontrado(res, 'Objeto no encontrado');
    return http.exitoso(res, objeto);
  },

  crear(req, res) {
    const resultado = new ServicioInventario().crearObjeto(req.body);
    if (!resultado.exito) return http.solicitudInvalida(res, 'Datos inválidos', resultado.errores);
    return http.creado(res, resultado.datos, 'Objeto creado exitosamente');
  },

  actualizar(req, res) {
    const resultado = new ServicioInventario().actualizarObjeto(req.params.id, req.body);
    if (!resultado.exito) return http.solicitudInvalida(res, 'Datos inválidos', resultado.errores);
    return http.exitoso(res, resultado.datos, 'Objeto actualizado exitosamente');
  },

  eliminar(req, res) {
    const resultado = new ServicioInventario().eliminarObjeto(req.params.id);
    if (!resultado.exito) return http.noEncontrado(res, 'Objeto no encontrado');
    return http.exitoso(res, null, 'Objeto eliminado exitosamente');
  },

  estadisticas(req, res) {
    const datos = new ServicioInventario().obtenerEstadisticas();
    return http.exitoso(res, datos);
  },
};

// ── Controlador de Traslados ──────────────────────────────────
const controladorTraslados = {
  listar(req, res) {
    const traslados = new ServicioTraslados().listarTraslados();
    return http.exitoso(res, traslados);
  },

  registrar(req, res) {
    const resultado = new ServicioTraslados().registrarTraslado(req.body);
    if (!resultado.exito) return http.solicitudInvalida(res, 'Datos inválidos', resultado.errores);
    return http.creado(res, resultado.datos, 'Traslado registrado exitosamente');
  },

  historialObjeto(req, res) {
    const historial = new ServicioTraslados().historialDeObjeto(req.params.idObjeto);
    return http.exitoso(res, historial);
  },
};

// ── Controlador de Calibraciones ─────────────────────────────
const controladorCalibraciones = {
  listar(req, res) {
    const calibraciones = new ServicioCalibraciones().listarCalibraciones();
    return http.exitoso(res, calibraciones);
  },

  registrar(req, res) {
    const resultado = new ServicioCalibraciones().registrarCalibracion(req.body);
    if (!resultado.exito) return http.solicitudInvalida(res, 'Datos inválidos', resultado.errores);
    return http.creado(res, resultado.datos, 'Calibración registrada exitosamente');
  },

  historialObjeto(req, res) {
    const historial = new ServicioCalibraciones().historialDeObjeto(req.params.idObjeto);
    return http.exitoso(res, historial);
  },
};

// ── Controlador de Checklist ──────────────────────────────────
const controladorChecklist = {
  listar(req, res) {
    const items = new ServicioChecklist().listarItems();
    return http.exitoso(res, items);
  },

  registrar(req, res) {
    const resultado = new ServicioChecklist().registrarItem(req.body);
    if (!resultado.exito) return http.solicitudInvalida(res, 'Datos inválidos', resultado.errores);
    return http.creado(res, resultado.datos, 'Item registrado exitosamente');
  },

  resumen(req, res) {
    const datos = new ServicioChecklist().resumenUltimoControl();
    return http.exitoso(res, datos);
  },
};

// ── Controlador de Importación / Exportación ─────────────────
const controladorImportExport = {
  importarExcel(req, res) {
    if (!req.file) return http.solicitudInvalida(res, 'No se recibió ningún archivo');

    try {
      const servicio   = new ServicioImportExport();
      const resultado  = servicio.importarDesdeExcel(req.file.path);
      return http.exitoso(res, resultado, `Importación completada: ${resultado.importados} registros`);
    } catch (error) {
      return http.errorServidor(res, `Error al importar: ${error.message}`);
    }
  },

  async importarCsv(req, res) {
    if (!req.file) return http.solicitudInvalida(res, 'No se recibió ningún archivo');

    try {
      const servicio  = new ServicioImportExport();
      const resultado = await servicio.importarDesdeCsv(req.file.path);
      return http.exitoso(res, resultado, `Importación completada: ${resultado.importados} registros`);
    } catch (error) {
      return http.errorServidor(res, `Error al importar: ${error.message}`);
    }
  },

  exportarExcel(req, res) {
    try {
      const buffer = new ServicioImportExport().exportarAExcel();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="inventario_ageso.xlsx"');
      return res.send(buffer);
    } catch (error) {
      return http.errorServidor(res, `Error al exportar: ${error.message}`);
    }
  },

  exportarCsv(req, res) {
    try {
      const csv = new ServicioImportExport().exportarACsv();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="inventario_ageso.csv"');
      return res.send('\uFEFF' + csv); // BOM para que Excel lo abra bien
    } catch (error) {
      return http.errorServidor(res, `Error al exportar: ${error.message}`);
    }
  },
};

module.exports = {
  controladorInventario,
  controladorTraslados,
  controladorCalibraciones,
  controladorChecklist,
  controladorImportExport,
};
