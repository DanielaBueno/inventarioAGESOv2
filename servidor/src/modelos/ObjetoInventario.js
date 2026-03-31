// ============================================================
// MODELO: ObjetoInventario
// modelos/ObjetoInventario.js
//
// Un modelo representa una entidad del negocio.
// Solo define la forma de los datos, no contiene lógica
// de base de datos ni de HTTP — eso es responsabilidad de
// los repositorios y controladores respectivamente (SRP).
// ============================================================

const { generarId } = require('../utilidades/generadorId');

class ObjetoInventario {
  constructor(datos = {}) {
    this.id                     = datos.id                     || generarId('OBJ');
    this.categoria              = datos.categoria              || '';
    this.codigoInventario       = datos.codigoInventario       || '';
    this.nombre                 = datos.nombre                 || '';
    this.serial                 = datos.serial                 || '';
    this.cantidadEtiquetas      = datos.cantidadEtiquetas      || 1;
    this.estado                 = datos.estado                 || 'Disponible';
    this.ubicacionActual        = datos.ubicacionActual        || '';
    this.requiereCalibracion    = datos.requiereCalibracion    || false;
    this.estadoCalibracion      = datos.estadoCalibracion      || 'No Aplica';
    this.fechaUltimaCalibracion = datos.fechaUltimaCalibracion || null;
    this.fechaProximaCalibracion= datos.fechaProximaCalibracion|| null;
    this.observaciones          = datos.observaciones          || '';
    this.urlFoto1               = datos.urlFoto1               || '';
    this.urlFoto2               = datos.urlFoto2               || '';
    this.urlFoto3               = datos.urlFoto3               || '';
    this.fechaCreacion          = datos.fechaCreacion          || new Date().toISOString();
    this.fechaActualizacion     = datos.fechaActualizacion     || new Date().toISOString();
  }

  /**
   * Actualiza el estado de calibración basándose en la fecha próxima.
   * Este es un ejemplo de lógica de negocio que vive en el modelo.
   */
  actualizarEstadoCalibracion() {
    if (!this.requiereCalibracion) {
      this.estadoCalibracion = 'No Aplica';
      return;
    }

    if (!this.fechaProximaCalibracion) {
      this.estadoCalibracion = 'Pendiente';
      return;
    }

    const hoy          = new Date();
    const fechaProxima = new Date(this.fechaProximaCalibracion);
    const diasRestantes = Math.floor((fechaProxima - hoy) / (1000 * 60 * 60 * 24));

    if      (diasRestantes < 0)  this.estadoCalibracion = 'Vencido';
    else if (diasRestantes <= 30) this.estadoCalibracion = 'Próximo a Vencer';
    else                         this.estadoCalibracion = 'Calibrado';
  }
}

module.exports = { ObjetoInventario };
