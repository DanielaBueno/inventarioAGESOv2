require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const { CONFIGURACION } = require('./configuracion/configuracion');
const { manejadorErroresGlobal, rutaNoEncontrada } = require('./utilidades/manejadorErrores');

const rutasInventario = require('./rutas/rutasInventario');
const { rutasCalibraciones, rutasChecklist, rutasImportExport } = require('./rutas/otrasRutas');
const rutasTraslados  = require('./rutas/rutasTraslados');

const app = express();

app.use(cors({ origin: CONFIGURACION.ORIGEN_FRONTEND }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/inventario',        rutasInventario);
app.use('/api/traslados',         rutasTraslados);
app.use('/api/calibraciones',     rutasCalibraciones);
app.use('/api/checklist',         rutasChecklist);
app.use('/api/importar-exportar', rutasImportExport);

app.get('/api/salud', (_req, res) => {
  res.json({ estado: 'activo', version: CONFIGURACION.VERSION });
});

app.use(rutaNoEncontrada);
app.use(manejadorErroresGlobal);

app.listen(CONFIGURACION.PUERTO, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${CONFIGURACION.PUERTO}`);
  console.log(`📦 Entorno: ${CONFIGURACION.ENTORNO}\n`);
});

module.exports = app;
