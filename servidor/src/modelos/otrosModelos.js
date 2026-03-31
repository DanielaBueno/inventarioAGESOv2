// ============================================================
// MODELOS: Traslado, Calibracion, ItemChecklist
// ============================================================

const { generarId } = require('../utilidades/generadorId');

// ── Traslado ──────────────────────────────────────────────────
class Traslado {
  constructor(datos = {}) {
    this.id                 = datos.id                 || generarId('TRA');
    this.idObjeto           = datos.idObjeto           || '';
    this.codigoInventario   = datos.codigoInventario   || '';
    this.nombreObjeto       = datos.nombreObjeto       || '';
    this.ubicacionOrigen    = datos.ubicacionOrigen    || '';
    this.ubicacionDestino   = datos.ubicacionDestino   || '';
    this.fechaTraslado      = datos.fechaTraslado      || new Date().toISOString();
    this.personaResponsable = datos.personaResponsable || '';
    this.observaciones      = datos.observaciones      || '';
    this.fechaRegistro      = datos.fechaRegistro      || new Date().toISOString();
  }
}

// ── Calibracion ───────────────────────────────────────────────
class Calibracion {
  constructor(datos = {}) {
    this.id                    = datos.id                    || generarId('CAL');
    this.idObjeto              = datos.idObjeto              || '';
    this.codigoInventario      = datos.codigoInventario      || '';
    this.nombreObjeto          = datos.nombreObjeto          || '';
    this.fechaCalibracion      = datos.fechaCalibracion      || new Date().toISOString();
    this.fechaProximaCalibracion = datos.fechaProximaCalibracion || null;
    this.resultado             = datos.resultado             || 'Aprobado';
    this.observaciones         = datos.observaciones         || '';
    this.fechaRegistro         = datos.fechaRegistro         || new Date().toISOString();
  }
}

// ── ItemChecklist ─────────────────────────────────────────────
class ItemChecklist {
  constructor(datos = {}) {
    this.id                 = datos.id                 || generarId('CHK');
    this.idObjeto           = datos.idObjeto           || '';
    this.codigoInventario   = datos.codigoInventario   || '';
    this.nombreObjeto       = datos.nombreObjeto       || '';
    this.fechaControl       = datos.fechaControl       || new Date().toISOString();
    this.verificado         = datos.verificado         ?? false;
    this.estadoFisico       = datos.estadoFisico       || '';
    this.etiquetaLegible    = datos.etiquetaLegible    ?? true;
    this.ubicacionCorrecta  = datos.ubicacionCorrecta  ?? true;
    this.observaciones      = datos.observaciones      || '';
    this.fechaRegistro      = datos.fechaRegistro      || new Date().toISOString();
  }
}

module.exports = { Traslado, Calibracion, ItemChecklist };
