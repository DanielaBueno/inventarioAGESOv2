// ============================================================
// REPOSITORIO BASE
// repositorios/RepositorioBase.js
//
// Esta clase es el corazón del patrón Repository.
// TODA la lógica de lectura/escritura de datos vive aquí.
//
// ¿Por qué es importante?
// El Servicio llama al Repositorio, pero NO sabe si los datos
// vienen de un archivo JSON, MySQL, PostgreSQL o una API remota.
// Cuando quieras migrar a MySQL: solo reescribes esta clase.
// Los servicios no cambian nada.
// ============================================================

const fs   = require('fs');
const path = require('path');
const { CONFIGURACION } = require('../configuracion/configuracion');

class RepositorioBase {
  /**
   * @param {string} nombreArchivo - Nombre del archivo JSON (sin extensión)
   * Ejemplo: new RepositorioBase('inventario') → lee/escribe datos/inventario.json
   */
  constructor(nombreArchivo) {
    this.rutaArchivo = path.join(CONFIGURACION.DIRECTORIO_DATOS, `${nombreArchivo}.json`);
    this._asegurarArchivoExiste();
  }

  // ── Métodos privados de acceso a archivo ─────────────────────

  _asegurarArchivoExiste() {
    const directorio = path.dirname(this.rutaArchivo);
    if (!fs.existsSync(directorio)) {
      fs.mkdirSync(directorio, { recursive: true });
    }
    if (!fs.existsSync(this.rutaArchivo)) {
      fs.writeFileSync(this.rutaArchivo, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _leerTodos() {
    const contenido = fs.readFileSync(this.rutaArchivo, 'utf-8');
    return JSON.parse(contenido);
  }

  _guardarTodos(registros) {
    fs.writeFileSync(this.rutaArchivo, JSON.stringify(registros, null, 2), 'utf-8');
  }

  // ── Operaciones CRUD públicas ─────────────────────────────────

  /**
   * Devuelve todos los registros.
   */
  obtenerTodos() {
    return this._leerTodos();
  }

  /**
   * Devuelve un registro por su ID, o null si no existe.
   */
  obtenerPorId(id) {
    const todos = this._leerTodos();
    return todos.find((registro) => registro.id === id) ?? null;
  }

  /**
   * Inserta un nuevo registro. Devuelve el registro insertado.
   */
  crear(entidad) {
    const todos = this._leerTodos();
    todos.push(entidad);
    this._guardarTodos(todos);
    return entidad;
  }

  /**
   * Actualiza un registro existente por ID.
   * Devuelve el registro actualizado, o null si no existe.
   */
  actualizar(id, cambios) {
    const todos   = this._leerTodos();
    const indice  = todos.findIndex((r) => r.id === id);

    if (indice === -1) return null;

    // Fusionamos los campos existentes con los cambios, preservando el id
    todos[indice] = {
      ...todos[indice],
      ...cambios,
      id,
      fechaActualizacion: new Date().toISOString(),
    };

    this._guardarTodos(todos);
    return todos[indice];
  }

  /**
   * Elimina un registro por ID.
   * Devuelve true si se eliminó, false si no existía.
   */
  eliminar(id) {
    const todos    = this._leerTodos();
    const filtrados = todos.filter((r) => r.id !== id);

    if (filtrados.length === todos.length) return false;

    this._guardarTodos(filtrados);
    return true;
  }

  /**
   * Devuelve el total de registros (útil para dashboards).
   */
  contarTodos() {
    return this._leerTodos().length;
  }
}

module.exports = { RepositorioBase };
