// ============================================================
// RUTAS DE CALIBRACIONES
// ============================================================
const { Router } = require('express');
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs');
const { CONFIGURACION } = require('../configuracion/configuracion');
const {
  controladorCalibraciones,
  controladorChecklist,
  controladorImportExport,
} = require('../controladores/index');

// ── Calibraciones ─────────────────────────────────────────────
const rutasCalibraciones = Router();

rutasCalibraciones.get('/',                        controladorCalibraciones.listar);
rutasCalibraciones.get('/objeto/:idObjeto',         controladorCalibraciones.historialObjeto);
rutasCalibraciones.post('/',                        controladorCalibraciones.registrar);

// ── Checklist ─────────────────────────────────────────────────
const rutasChecklist = Router();

rutasChecklist.get('/',           controladorChecklist.listar);
rutasChecklist.get('/resumen',    controladorChecklist.resumen);
rutasChecklist.post('/',          controladorChecklist.registrar);

// ── Importar / Exportar ───────────────────────────────────────
// Configuración de multer para recibir archivos subidos
const directorioTemp = CONFIGURACION.DIRECTORIO_TEMP;
if (!fs.existsSync(directorioTemp)) fs.mkdirSync(directorioTemp, { recursive: true });

const almacenamientoTemp = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, directorioTemp),
  filename:    (_req, file, cb) => cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`),
});

const subirArchivo = multer({
  storage: almacenamientoTemp,
  fileFilter: (_req, file, cb) => {
    const extensionesPermitidas = ['.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (extensionesPermitidas.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos .xlsx y .csv'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB máximo
});

const rutasImportExport = Router();

rutasImportExport.post('/importar/excel', subirArchivo.single('archivo'), controladorImportExport.importarExcel);
rutasImportExport.post('/importar/csv',   subirArchivo.single('archivo'), controladorImportExport.importarCsv);
rutasImportExport.get('/exportar/excel',  controladorImportExport.exportarExcel);
rutasImportExport.get('/exportar/csv',    controladorImportExport.exportarCsv);

module.exports = { rutasCalibraciones, rutasChecklist, rutasImportExport };
