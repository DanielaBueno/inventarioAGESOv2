// ============================================================
// SERVICIO DE INVENTARIO
// servicios/ServicioInventario.js
//
// El servicio contiene la lógica de negocio.
// No sabe nada de HTTP (req, res) — eso es el controlador.
// No sabe nada de archivos JSON — eso es el repositorio.
// Solo sabe de REGLAS DEL NEGOCIO.
// ============================================================

const { ObjetoInventario }      = require('../modelos/ObjetoInventario');
const { RepositorioInventario } = require('../repositorios/RepositorioInventario');
const { validarObjetoInventario } = require('../utilidades/validadores');

class ServicioInventario {
  constructor() {
    // Principio D de SOLID: el servicio depende de una abstracción (repositorio),
    // no de una implementación concreta (MySQL, JSON, etc.)
    this.repositorio = new RepositorioInventario();
  }

  /**
   * Crea un nuevo objeto en el inventario.
   * @param {Object} datos - Datos del formulario
   * @returns {{ exito: boolean, datos?: Object, errores?: string[] }}
   */
  crearObjeto(datos) {
    const errores = validarObjetoInventario(datos);
    if (errores.length > 0) return { exito: false, errores };

    if (this.repositorio.existeCodigo(datos.codigoInventario)) {
      return {
        exito: false,
        errores: [`El código "${datos.codigoInventario}" ya está registrado`],
      };
    }

    const objeto = new ObjetoInventario(datos);
    objeto.actualizarEstadoCalibracion();

    const guardado = this.repositorio.crear(objeto);
    return { exito: true, datos: guardado };
  }

  /**
   * Actualiza un objeto existente.
   */
  actualizarObjeto(id, datos) {
    const existente = this.repositorio.obtenerPorId(id);
    if (!existente) return { exito: false, errores: ['Objeto no encontrado'] };

    const errores = validarObjetoInventario({ ...existente, ...datos });
    if (errores.length > 0) return { exito: false, errores };

    if (datos.codigoInventario) {
      const codigoDuplicado = this.repositorio.existeCodigo(datos.codigoInventario, id);
      if (codigoDuplicado) {
        return {
          exito: false,
          errores: [`El código "${datos.codigoInventario}" ya pertenece a otro objeto`],
        };
      }
    }

    // Actualizamos campos de calibración si cambiaron las fechas
    const objetoActualizado = new ObjetoInventario({ ...existente, ...datos });
    objetoActualizado.actualizarEstadoCalibracion();

    const resultado = this.repositorio.actualizar(id, objetoActualizado);
    return { exito: true, datos: resultado };
  }

  /**
   * Obtiene todos los objetos del inventario.
   */
  listarObjetos() {
    return this.repositorio.obtenerTodos();
  }

  /**
   * Busca objetos con filtros opcionales.
   */
  buscarObjetos(criterios = {}) {
    return this.repositorio.buscar(criterios);
  }

  /**
   * Obtiene un objeto por su ID.
   */
  obtenerObjeto(id) {
    return this.repositorio.obtenerPorId(id);
  }

  /**
   * Elimina un objeto del inventario.
   */
  eliminarObjeto(id) {
    const eliminado = this.repositorio.eliminar(id);
    if (!eliminado) return { exito: false, errores: ['Objeto no encontrado'] };
    return { exito: true };
  }

  /**
   * Estadísticas para el dashboard.
   */
  obtenerEstadisticas() {
    return this.repositorio.obtenerEstadisticas();
  }
}

module.exports = { ServicioInventario };
