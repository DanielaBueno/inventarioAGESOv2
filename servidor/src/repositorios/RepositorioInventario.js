// ============================================================
// REPOSITORIO DE INVENTARIO
// repositorios/RepositorioInventario.js
//
// Extiende RepositorioBase con búsquedas específicas del dominio.
// ============================================================

const { RepositorioBase } = require('./RepositorioBase');

class RepositorioInventario extends RepositorioBase {
  constructor() {
    super('inventario'); // Leerá/escribirá en datos/inventario.json
  }

  /**
   * Verifica si ya existe un objeto con ese código de inventario.
   * Útil para validar duplicados antes de insertar.
   * @param {string} codigo
   * @param {string} [idExcluir] - ID a ignorar (para edición)
   */
  existeCodigo(codigo, idExcluir = null) {
    const todos = this.obtenerTodos();
    return todos.some(
      (obj) => obj.codigoInventario === codigo && obj.id !== idExcluir
    );
  }

  /**
   * Búsqueda flexible por texto y/o filtros.
   * @param {Object} criterios - { texto, categoria, estado, ubicacion }
   */
  buscar(criterios = {}) {
    let resultados = this.obtenerTodos();

    if (criterios.texto) {
      const textoBusqueda = criterios.texto.toLowerCase();
      resultados = resultados.filter(
        (obj) =>
          obj.nombre.toLowerCase().includes(textoBusqueda)          ||
          obj.codigoInventario.toLowerCase().includes(textoBusqueda) ||
          obj.serial?.toLowerCase().includes(textoBusqueda)          ||
          obj.ubicacionActual.toLowerCase().includes(textoBusqueda)
      );
    }

    if (criterios.categoria) {
      resultados = resultados.filter((obj) => obj.categoria === criterios.categoria);
    }

    if (criterios.estado) {
      resultados = resultados.filter((obj) => obj.estado === criterios.estado);
    }

    if (criterios.ubicacion) {
      resultados = resultados.filter((obj) =>
        obj.ubicacionActual.toLowerCase().includes(criterios.ubicacion.toLowerCase())
      );
    }

    return resultados;
  }

  /**
   * Devuelve objetos cuya calibración está vencida o próxima a vencer.
   */
  obtenerPorVencerCalibracion() {
    const hoy = new Date();
    return this.obtenerTodos().filter((obj) => {
      if (!obj.requiereCalibracion || !obj.fechaProximaCalibracion) return false;
      const fechaProxima = new Date(obj.fechaProximaCalibracion);
      const diasRestantes = Math.floor((fechaProxima - hoy) / (1000 * 60 * 60 * 24));
      return diasRestantes <= 30;
    });
  }

  /**
   * Estadísticas rápidas para el dashboard.
   */
  obtenerEstadisticas() {
    const todos = this.obtenerTodos();

    return {
      total:              todos.length,
      porEstado:          _contarPor(todos, 'estado'),
      porCategoria:       _contarPor(todos, 'categoria'),
      calibracionVencida: todos.filter((o) => o.estadoCalibracion === 'Vencido').length,
      calibracionPorVencer: todos.filter((o) => o.estadoCalibracion === 'Próximo a Vencer').length,
    };
  }
}

// ── Función auxiliar privada (no exportada) ───────────────────
function _contarPor(lista, campo) {
  return lista.reduce((acumulador, item) => {
    const valor = item[campo] || 'Sin definir';
    acumulador[valor] = (acumulador[valor] || 0) + 1;
    return acumulador;
  }, {});
}

module.exports = { RepositorioInventario };
