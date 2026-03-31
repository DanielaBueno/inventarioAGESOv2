// ============================================================
// SERVICIOS: Traslados, Calibraciones, Checklist
// ============================================================

const { Traslado, Calibracion, ItemChecklist } = require('../modelos/otrosModelos');
const {
  RepositorioTraslados,
  RepositorioCalibraciones,
  RepositorioChecklist,
} = require('../repositorios/otrosRepositorios');
const { RepositorioInventario } = require('../repositorios/RepositorioInventario');
const {
  validarTraslado,
  validarCalibracion,
  validarItemChecklist,
} = require('../utilidades/validadores');

// ── Servicio de Traslados ─────────────────────────────────────
class ServicioTraslados {
  constructor() {
    this.repositorio           = new RepositorioTraslados();
    this.repositorioInventario = new RepositorioInventario();
  }

  registrarTraslado(datos) {
    const errores = validarTraslado(datos);
    if (errores.length > 0) return { exito: false, errores };

    const objeto = this.repositorioInventario.obtenerPorId(datos.idObjeto);
    if (!objeto) return { exito: false, errores: ['El objeto de inventario no existe'] };

    const traslado = new Traslado({
      ...datos,
      codigoInventario: objeto.codigoInventario,
      nombreObjeto:     objeto.nombre,
      ubicacionOrigen:  objeto.ubicacionActual,
    });

    // Actualizar la ubicación del objeto en inventario
    this.repositorioInventario.actualizar(datos.idObjeto, {
      ubicacionActual: datos.ubicacionDestino,
    });

    const guardado = this.repositorio.crear(traslado);
    return { exito: true, datos: guardado };
  }

  listarTraslados() {
    return this.repositorio.obtenerTodos();
  }

  historialDeObjeto(idObjeto) {
    return this.repositorio.obtenerPorObjeto(idObjeto);
  }
}

// ── Servicio de Calibraciones ─────────────────────────────────
class ServicioCalibraciones {
  constructor() {
    this.repositorio           = new RepositorioCalibraciones();
    this.repositorioInventario = new RepositorioInventario();
  }

  registrarCalibracion(datos) {
    const errores = validarCalibracion(datos);
    if (errores.length > 0) return { exito: false, errores };

    const objeto = this.repositorioInventario.obtenerPorId(datos.idObjeto);
    if (!objeto) return { exito: false, errores: ['El objeto de inventario no existe'] };

    const calibracion = new Calibracion({
      ...datos,
      codigoInventario: objeto.codigoInventario,
      nombreObjeto:     objeto.nombre,
    });

    // Actualizar fechas de calibración en el inventario
    this.repositorioInventario.actualizar(datos.idObjeto, {
      fechaUltimaCalibracion:  datos.fechaCalibracion,
      fechaProximaCalibracion: datos.fechaProximaCalibracion,
      estadoCalibracion:       datos.resultado === 'Aprobado' ? 'Calibrado' : 'Pendiente',
    });

    const guardado = this.repositorio.crear(calibracion);
    return { exito: true, datos: guardado };
  }

  listarCalibraciones() {
    return this.repositorio.obtenerTodos();
  }

  historialDeObjeto(idObjeto) {
    return this.repositorio.obtenerPorObjeto(idObjeto);
  }
}

// ── Servicio de Checklist ─────────────────────────────────────
class ServicioChecklist {
  constructor() {
    this.repositorio           = new RepositorioChecklist();
    this.repositorioInventario = new RepositorioInventario();
  }

  registrarItem(datos) {
    const errores = validarItemChecklist(datos);
    if (errores.length > 0) return { exito: false, errores };

    const objeto = this.repositorioInventario.obtenerPorId(datos.idObjeto);
    if (!objeto) return { exito: false, errores: ['El objeto de inventario no existe'] };

    const item = new ItemChecklist({
      ...datos,
      codigoInventario: objeto.codigoInventario,
      nombreObjeto:     objeto.nombre,
    });

    const guardado = this.repositorio.crear(item);
    return { exito: true, datos: guardado };
  }

  listarItems() {
    return this.repositorio.obtenerTodos();
  }

  resumenUltimoControl() {
    return this.repositorio.obtenerResumenUltimoControl();
  }
}

module.exports = { ServicioTraslados, ServicioCalibraciones, ServicioChecklist };
