// ============================================================
// SERVICIO DE IMPORTACIÓN / EXPORTACIÓN
// servicios/ServicioImportExport.js
//
// Maneja la lectura de archivos .xlsx / .csv
// y la generación de archivos para descarga.
// ============================================================

const xlsx       = require('xlsx');
const fs         = require('fs');
const path       = require('path');
const csvParser  = require('csv-parser');
const { ObjetoInventario } = require('../modelos/ObjetoInventario');
const { RepositorioInventario } = require('../repositorios/RepositorioInventario');
const { CONFIGURACION } = require('../configuracion/configuracion');

class ServicioImportExport {
  constructor() {
    this.repositorio = new RepositorioInventario();
  }

  // ── IMPORTAR ────────────────────────────────────────────────

  /**
   * Importa objetos desde un archivo Excel (.xlsx).
   * Mapea las columnas del archivo a los campos del modelo.
   * @param {string} rutaArchivo - Ruta temporal del archivo subido
   */
  importarDesdeExcel(rutaArchivo) {
    const libro      = xlsx.readFile(rutaArchivo);
    const hoja       = libro.Sheets[libro.SheetNames[0]];
    const filas      = xlsx.utils.sheet_to_json(hoja);

    const resultados = { importados: 0, omitidos: 0, errores: [] };

    filas.forEach((fila, indice) => {
      try {
        const datos = this._mapearFilaAObjeto(fila);
        if (this.repositorio.existeCodigo(datos.codigoInventario)) {
          resultados.omitidos++;
          resultados.errores.push(`Fila ${indice + 2}: código "${datos.codigoInventario}" ya existe`);
          return;
        }

        const objeto = new ObjetoInventario(datos);
        objeto.actualizarEstadoCalibracion();
        this.repositorio.crear(objeto);
        resultados.importados++;
      } catch (error) {
        resultados.omitidos++;
        resultados.errores.push(`Fila ${indice + 2}: ${error.message}`);
      }
    });

    return resultados;
  }

  /**
   * Importa objetos desde un archivo CSV.
   * Devuelve una Promesa porque csv-parser es asíncrono.
   * @param {string} rutaArchivo
   */
  importarDesdeCsv(rutaArchivo) {
    return new Promise((resolve, reject) => {
      const resultados = { importados: 0, omitidos: 0, errores: [] };
      let indice = 0;

      fs.createReadStream(rutaArchivo)
        .pipe(csvParser())
        .on('data', (fila) => {
          indice++;
          try {
            const datos = this._mapearFilaAObjeto(fila);
            if (this.repositorio.existeCodigo(datos.codigoInventario)) {
              resultados.omitidos++;
              resultados.errores.push(`Fila ${indice + 1}: código "${datos.codigoInventario}" ya existe`);
              return;
            }
            const objeto = new ObjetoInventario(datos);
            objeto.actualizarEstadoCalibracion();
            this.repositorio.crear(objeto);
            resultados.importados++;
          } catch (error) {
            resultados.omitidos++;
            resultados.errores.push(`Fila ${indice + 1}: ${error.message}`);
          }
        })
        .on('end', () => resolve(resultados))
        .on('error', reject);
    });
  }

  // ── EXPORTAR ────────────────────────────────────────────────

  /**
   * Genera un archivo Excel con todo el inventario.
   * Devuelve el buffer del archivo para enviarlo como descarga.
   */
  exportarAExcel() {
    const objetos  = this.repositorio.obtenerTodos();
    const filas    = objetos.map(this._mapearObjetoAFila);

    const encabezados = [
      'ID', 'Categoría', 'Código Inventario', 'Nombre', 'Serial',
      'Cantidad Etiquetas', 'Estado', 'Ubicación Actual',
      'Requiere Calibración', 'Estado Calibración',
      'Fecha Última Calibración', 'Fecha Próxima Calibración',
      'Observaciones', 'Fecha Creación',
    ];

    const hoja  = xlsx.utils.aoa_to_sheet([encabezados, ...filas]);
    const libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, hoja, 'Inventario');

    // Aplicar estilos básicos de ancho
    hoja['!cols'] = encabezados.map(() => ({ wch: 20 }));

    return xlsx.write(libro, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Genera una cadena CSV con todo el inventario.
   */
  exportarACsv() {
    const objetos = this.repositorio.obtenerTodos();

    const encabezados = [
      'id', 'categoria', 'codigoInventario', 'nombre', 'serial',
      'cantidadEtiquetas', 'estado', 'ubicacionActual',
      'requiereCalibracion', 'estadoCalibracion',
      'fechaUltimaCalibracion', 'fechaProximaCalibracion',
      'observaciones', 'fechaCreacion',
    ];

    const lineas = [
      encabezados.join(','),
      ...objetos.map((obj) =>
        encabezados
          .map((campo) => {
            const valor = obj[campo] ?? '';
            // Escapar comas y comillas dentro del valor
            const cadena = String(valor).replace(/"/g, '""');
            return cadena.includes(',') ? `"${cadena}"` : cadena;
          })
          .join(',')
      ),
    ];

    return lineas.join('\n');
  }

  // ── Métodos de mapeo (privados) ──────────────────────────────

  /**
   * Traduce una fila del archivo (columnas en español o inglés)
   * a los campos del modelo ObjetoInventario.
   */
  _mapearFilaAObjeto(fila) {
    return {
      categoria:           fila['Categoría']           || fila['categoria']           || '',
      codigoInventario:    fila['Código Inventario']   || fila['codigoInventario']    || '',
      nombre:              fila['Nombre']              || fila['nombre']              || '',
      serial:              fila['Serial']              || fila['serial']              || '',
      cantidadEtiquetas:   Number(fila['Cantidad Etiquetas'] || fila['cantidadEtiquetas'] || 1),
      estado:              fila['Estado']              || fila['estado']              || 'Disponible',
      ubicacionActual:     fila['Ubicación Actual']    || fila['ubicacionActual']     || '',
      requiereCalibracion: String(fila['Requiere Calibración'] || fila['requiereCalibracion'] || 'false').toLowerCase() === 'true',
      observaciones:       fila['Observaciones']       || fila['observaciones']       || '',
    };
  }

  _mapearObjetoAFila(obj) {
    return [
      obj.id,
      obj.categoria,
      obj.codigoInventario,
      obj.nombre,
      obj.serial,
      obj.cantidadEtiquetas,
      obj.estado,
      obj.ubicacionActual,
      obj.requiereCalibracion ? 'Sí' : 'No',
      obj.estadoCalibracion,
      obj.fechaUltimaCalibracion  || '',
      obj.fechaProximaCalibracion || '',
      obj.observaciones,
      obj.fechaCreacion,
    ];
  }
}

module.exports = { ServicioImportExport };
