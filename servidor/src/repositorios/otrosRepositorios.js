// ============================================================
// REPOSITORIOS: Traslados, Calibraciones, Checklist
// ============================================================

const { RepositorioBase } = require('./RepositorioBase');

// ── Repositorio de Traslados ──────────────────────────────────
class RepositorioTraslados extends RepositorioBase {
  constructor() {
    super('traslados');
  }

  /**
   * Devuelve el historial de traslados de un objeto específico.
   */
  obtenerPorObjeto(idObjeto) {
    return this.obtenerTodos()
      .filter((t) => t.idObjeto === idObjeto)
      .sort((a, b) => new Date(b.fechaTraslado) - new Date(a.fechaTraslado));
  }
}

// ── Repositorio de Calibraciones ─────────────────────────────
class RepositorioCalibraciones extends RepositorioBase {
  constructor() {
    super('calibraciones');
  }

  /**
   * Devuelve el historial de calibraciones de un objeto específico.
   */
  obtenerPorObjeto(idObjeto) {
    return this.obtenerTodos()
      .filter((c) => c.idObjeto === idObjeto)
      .sort((a, b) => new Date(b.fechaCalibracion) - new Date(a.fechaCalibracion));
  }
}

// ── Repositorio de Checklist ──────────────────────────────────
class RepositorioChecklist extends RepositorioBase {
  constructor() {
    super('checklist');
  }

  /**
   * Devuelve todos los items de una sesión de control (por fecha).
   */
  obtenerPorFecha(fecha) {
    return this.obtenerTodos().filter((item) =>
      item.fechaControl?.startsWith(fecha)
    );
  }

  /**
   * Resumen del último control realizado.
   */
  obtenerResumenUltimoControl() {
    const todos = this.obtenerTodos();
    if (todos.length === 0) return null;

    const ultimo = todos.reduce((mas_reciente, item) =>
      new Date(item.fechaControl) > new Date(mas_reciente.fechaControl)
        ? item
        : mas_reciente
    );

    const mismaFecha = todos.filter((i) =>
      i.fechaControl?.substring(0, 10) === ultimo.fechaControl?.substring(0, 10)
    );

    return {
      fecha:       ultimo.fechaControl?.substring(0, 10),
      total:       mismaFecha.length,
      verificados: mismaFecha.filter((i) => i.verificado).length,
      conProblemas: mismaFecha.filter((i) => i.estadoFisico === 'Malo').length,
    };
  }
}

module.exports = { RepositorioTraslados, RepositorioCalibraciones, RepositorioChecklist };
