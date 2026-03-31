# 📦 Sistema de Inventario AGESO
### Documentación Técnica Completa

---

> **Versión actual:** 2.0.0 · **Última actualización:** Marzo 2026 · **Estado:** En desarrollo activo

---

## 📋 Tabla de Contenido

1. [¿Qué es este sistema?](#1-qué-es-este-sistema)
2. [Funcionalidades del software](#2-funcionalidades-del-software)
3. [Tecnologías y lenguajes utilizados](#3-tecnologías-y-lenguajes-utilizados)
4. [Arquitectura del sistema](#4-arquitectura-del-sistema)
5. [Estructura de carpetas](#5-estructura-de-carpetas)
6. [Cómo funciona por dentro](#6-cómo-funciona-por-dentro)
7. [Control de versiones](#7-control-de-versiones)
8. [Cómo instalar y ejecutar](#8-cómo-instalar-y-ejecutar)

---

## 1. ¿Qué es este sistema?

El **Sistema de Inventario AGESO** es una aplicación web que corre en tu computador (sin necesidad de internet) y permite a equipos pequeños (2 a 5 personas) gestionar de forma organizada los objetos físicos de una organización: equipos médicos, de oficina, herramientas, consumibles, y más.

El sistema nació como una migración desde **Google Apps Script + Google Sheets** hacia una solución más robusta, profesional y fácil de mantener a largo plazo.

### ¿Para quién es?

Está pensado para organizaciones que necesitan:

- Saber qué objetos tienen, dónde están y en qué estado.
- Controlar si los equipos están al día con sus calibraciones.
- Registrar cuando un objeto se mueve de un lugar a otro.
- Importar y exportar datos en Excel o CSV.
- Escalar el sistema en el futuro (red local, nube, más usuarios).

---

## 2. Funcionalidades del Software

### 2.1 Módulo de Inventario

El módulo principal del sistema. Permite gestionar el ciclo de vida completo de cada objeto registrado.

| Funcionalidad | Descripción |
|---|---|
| **Crear objeto** | Registra un nuevo objeto con todos sus datos: categoría, código, nombre, serial, estado, ubicación y más. |
| **Editar objeto** | Modifica cualquier campo de un objeto ya registrado. |
| **Eliminar objeto** | Elimina un objeto del inventario con confirmación previa. |
| **Buscar objetos** | Búsqueda en tiempo real por nombre, código o serial. |
| **Filtrar objetos** | Filtra la lista por categoría, estado o ubicación. |
| **Ver detalle** | Muestra toda la información de un objeto en un panel. |

**Categorías disponibles:**
- Equipos Médicos
- Equipos de Oficina
- Accesorios
- Equipos de Emergencia
- Cafetería
- Herramientas
- Archivo
- Consumibles

**Estados de un objeto:**
- `Disponible` — listo para usar.
- `En uso` — actualmente en operación.
- `En reparación` — fuera de servicio temporalmente.
- `Dado de baja` — retirado del inventario.

---

### 2.2 Módulo de Traslados

Registra el historial de movimientos de los objetos entre ubicaciones.

| Funcionalidad | Descripción |
|---|---|
| **Registrar traslado** | Documenta el movimiento de un objeto de una ubicación a otra. |
| **Actualizar ubicación automáticamente** | Al registrar un traslado, la ubicación del objeto en inventario se actualiza sola. |
| **Ver historial** | Lista todos los traslados ordenados por fecha, con origen, destino y responsable. |

Cada traslado registra: el objeto movido, la ubicación de origen, la de destino, la persona responsable, la fecha y observaciones.

---

### 2.3 Módulo de Calibraciones

Controla el estado de calibración de los equipos que lo requieren.

| Funcionalidad | Descripción |
|---|---|
| **Registrar calibración** | Documenta una calibración con fecha, resultado y próxima fecha. |
| **Actualizar estado automáticamente** | Al registrar, el estado del objeto en inventario se actualiza (Calibrado / Vencido / Próximo a Vencer). |
| **Alertas visuales** | El panel muestra una advertencia cuando hay equipos con calibración vencida o próxima a vencer (dentro de 30 días). |
| **Historial por equipo** | Consulta todas las calibraciones de un objeto específico. |

**Estados de calibración:**
- `Calibrado` — vigente.
- `Próximo a Vencer` — vence en menos de 30 días.
- `Vencido` — fecha pasada.
- `Pendiente` — requiere calibración pero no tiene fecha registrada.
- `No Aplica` — el objeto no requiere calibración.

---

### 2.4 Módulo de Checklist (Control de Inventario)

Permite hacer verificaciones físicas periódicas de los objetos.

| Funcionalidad | Descripción |
|---|---|
| **Iniciar sesión de control** | Genera automáticamente una lista con todos los objetos del inventario para verificar. |
| **Verificación por objeto** | Para cada objeto: marcar como verificado, registrar estado físico (Bueno / Regular / Malo), confirmar etiqueta legible y ubicación correcta. |
| **Barra de progreso** | Muestra en tiempo real cuántos objetos han sido verificados. |
| **Guardar sesión** | Registra solo los ítems verificados con observaciones. |
| **Resumen del último control** | Panel con totales: revisados, verificados OK y con problemas. |
| **Historial de controles** | Lista todas las verificaciones realizadas anteriormente. |

---

### 2.5 Módulo de Importación / Exportación

Permite conectar el sistema con archivos de Excel y CSV.

| Funcionalidad | Descripción |
|---|---|
| **Importar desde Excel (.xlsx)** | Lee un archivo Excel y carga los objetos al inventario. Detecta duplicados y los omite. |
| **Importar desde CSV (.csv)** | Igual que Excel pero con archivos de texto separados por comas. |
| **Exportar a Excel (.xlsx)** | Descarga todo el inventario en un archivo Excel con formato. |
| **Exportar a CSV (.csv)** | Descarga todo el inventario en formato CSV (compatible con Excel, LibreOffice, etc.). |

El sistema acepta columnas en español o en formato técnico (inglés) en los archivos importados.

---

### 2.6 Dashboard

Pantalla principal con estadísticas en tiempo real.

| Indicador | Descripción |
|---|---|
| **Total de objetos** | Cantidad total de objetos registrados. |
| **Disponibles** | Objetos en estado "Disponible". |
| **Calibración vencida** | Equipos con calibración vencida. |
| **Por vencer** | Equipos que vencen en menos de 30 días. |
| **Distribución por categoría** | Gráfico de barras con cantidad por categoría. |
| **Distribución por estado** | Lista de conteo por estado. |

---

### 2.7 Indicador de estado del servidor

En la barra de navegación hay un pequeño badge que muestra si el servidor está activo o no. Si el servidor no está corriendo, aparece en rojo como `Sin conexión`.

---

## 3. Tecnologías y Lenguajes Utilizados

El sistema tiene dos partes bien diferenciadas: el **cliente** (lo que ves en el navegador) y el **servidor** (el motor que procesa los datos).

### 3.1 Lenguajes

| Lenguaje | Dónde se usa | ¿Por qué? |
|---|---|---|
| **JavaScript (ES2022+)** | Cliente y servidor | Lenguaje único para todo el proyecto. Reduce la fricción al no tener que cambiar de lenguaje. |
| **HTML5** | Cliente | Estructura base de las páginas. |
| **CSS3** | Cliente | Estilos visuales, aunque mayormente manejados por Bootstrap. |
| **JSON** | Almacenamiento | Formato de los archivos de datos (base de datos temporal). |
| **Markdown** | Documentación | Este documento. |

### 3.2 Frontend (lo que ve el usuario)

| Tecnología | Versión | Rol |
|---|---|---|
| **Vue 3** | 3.3.x | Framework principal de la interfaz. Maneja las vistas, componentes y reactividad. |
| **Vite** | 5.0.x | Herramienta de construcción y servidor de desarrollo. Hace que el frontend cargue muy rápido. |
| **Pinia** | 2.1.x | Manejo del estado global. Guarda datos compartidos entre componentes (ej: lista de inventario). |
| **Vue Router** | 4.2.x | Navegación entre páginas sin recargar el navegador. |
| **Axios** | 1.6.x | Librería para hacer llamadas HTTP a la API del servidor. |
| **Bootstrap** | 5.3.x | Framework de estilos CSS. Proporciona tablas, botones, modales, formularios, etc. |
| **Bootstrap Icons** | 1.11.x | Íconos vectoriales utilizados en toda la interfaz. |

### 3.3 Backend (el motor)

| Tecnología | Versión | Rol |
|---|---|---|
| **Node.js** | 18+ | Entorno de ejecución de JavaScript en el servidor. |
| **Express** | 4.18.x | Framework para construir la API REST. Maneja rutas y peticiones HTTP. |
| **multer** | 1.4.x | Middleware para recibir archivos subidos por el usuario (Excel/CSV). |
| **SheetJS (xlsx)** | 0.18.x | Librería para leer y generar archivos Excel `.xlsx`. |
| **csv-parser** | 3.0.x | Librería para leer archivos CSV de forma eficiente. |
| **uuid** | 9.0.x | Generador de IDs únicos para cada registro. |
| **dotenv** | 16.3.x | Carga variables de entorno desde el archivo `.env`. |
| **cors** | 2.8.x | Permite que el frontend (puerto 5173) se comunique con el backend (puerto 3000). |
| **nodemon** | 3.0.x | Reinicia el servidor automáticamente cuando detecta cambios en el código. Solo en desarrollo. |

### 3.4 Almacenamiento

Actualmente el sistema usa **archivos JSON** como base de datos. Cada módulo tiene su propio archivo:

| Archivo | Contenido |
|---|---|
| `datos/inventario.json` | Todos los objetos del inventario |
| `datos/traslados.json` | Historial de traslados |
| `datos/calibraciones.json` | Historial de calibraciones |
| `datos/checklist.json` | Historial de controles de inventario |

> **Nota de escalabilidad:** Esta decisión es temporal e intencional. La arquitectura del sistema está diseñada para que migrar a MySQL u otra base de datos solo requiera modificar los archivos de repositorios, sin tocar la lógica de negocio ni el frontend.

---

## 4. Arquitectura del Sistema

### 4.1 Arquitectura general: Cliente-Servidor desacoplado

```
┌─────────────────────────┐         HTTP/JSON        ┌─────────────────────────┐
│                         │ ◄──── /api/inventario ───►│                         │
│   CLIENTE (Vue 3)        │       /api/traslados      │   SERVIDOR (Express)    │
│   localhost:5173        │       /api/calibraciones  │   localhost:3000        │
│                         │       /api/checklist      │                         │
└─────────────────────────┘                           └─────────────────────────┘
```

El cliente y el servidor son **proyectos completamente separados**. Se comunican únicamente a través de una API REST usando el formato JSON. Esta separación tiene una ventaja enorme: si en el futuro quieres hacer una app móvil, puede usar la misma API sin ningún cambio.

---

### 4.2 Patrón de diseño: MVC + Repository Pattern

La arquitectura interna del servidor sigue el patrón **MVC** (Modelo - Vista - Controlador) extendido con el **Repository Pattern**. Esto se eligió sobre Clean Architecture completa porque es más fácil de entender para alguien que está aprendiendo, pero igual de escalable.

```
Petición HTTP
     │
     ▼
┌──────────┐    llama a    ┌──────────────┐    llama a    ┌──────────────┐    accede a    ┌──────────┐
│  RUTAS   │──────────────►│ CONTROLADOR  │──────────────►│   SERVICIO   │──────────────►│REPOSITORIO│
│(Express) │               │(HTTP → Datos)│               │(Lógica de    │               │(Datos →  │
│          │               │              │               │ negocio)     │               │Archivo)  │
└──────────┘               └──────────────┘               └──────────────┘               └──────────┘
                                                                                               │
                                                                                               ▼
                                                                                         ┌──────────┐
                                                                                         │  DATOS   │
                                                                                         │  (JSON)  │
                                                                                         └──────────┘
```

**¿Qué hace cada capa?**

| Capa | Archivo ejemplo | Responsabilidad |
|---|---|---|
| **Rutas** | `rutasInventario.js` | Define qué URLs existen y qué método HTTP aceptan. |
| **Controladores** | `controladores/index.js` | Extrae datos del request HTTP y llama al servicio. No tiene lógica de negocio. |
| **Servicios** | `ServicioInventario.js` | Contiene las reglas del negocio: validaciones, cálculos, decisiones. No sabe nada de HTTP ni de base de datos. |
| **Repositorios** | `RepositorioInventario.js` | Único lugar que accede a los datos. Si mañana cambias de JSON a MySQL, solo cambias esta capa. |
| **Modelos** | `ObjetoInventario.js` | Define la forma de los datos y la lógica propia de cada entidad (ej: calcular estado de calibración). |

---

### 4.3 Principios aplicados (SOLID + DRY)

| Principio | Cómo se aplica |
|---|---|
| **S — Responsabilidad única** | Cada archivo tiene una sola razón para cambiar. El repositorio solo habla con datos, el servicio solo tiene lógica de negocio, el controlador solo traduce HTTP. |
| **O — Abierto/Cerrado** | Para agregar un módulo nuevo (ej: reportes) se crean nuevos archivos. Los existentes no se tocan. |
| **L — Sustitución de Liskov** | `RepositorioInventario` extiende `RepositorioBase`. Puede reemplazarlo sin romper los servicios. |
| **I — Segregación de interfaces** | Servicios pequeños y específicos (`ServicioTraslados`, `ServicioCalibraciones`) en lugar de un único servicio gigante. |
| **D — Inversión de dependencias** | El servicio depende del repositorio (abstracción), no de MySQL o JSON directamente. |
| **DRY — No repetirse** | `RepositorioBase` tiene el CRUD genérico. Todos los repositorios lo heredan sin duplicar código. `respuestaHttp.js` centraliza el formato de todas las respuestas. |

---

### 4.4 Arquitectura del Frontend (Vue 3)

El frontend sigue el patrón **Composición de componentes** con estado centralizado:

```
App.vue (raíz)
  │
  ├── Barra de navegación
  ├── <RouterView>  ← Aquí se montan las vistas según la URL
  │     ├── VistaDashboard.vue
  │     ├── VistaInventario.vue
  │     │     ├── FormularioObjeto.vue   (componente)
  │     │     └── ModalConfirmacion.vue  (componente)
  │     ├── VistaTraslados.vue
  │     │     └── FormularioTraslado.vue (componente)
  │     ├── VistaCalibraciones.vue
  │     └── VistaChecklist.vue
  └── Toast de notificaciones globales
```

**Flujo de datos en el frontend:**

```
Vista  ──llama──►  Almacén (Pinia)  ──llama──►  Servicio HTTP  ──HTTP──►  API
 ▲                      │
 └────── reactividad ───┘
  (Vue actualiza la vista
   automáticamente cuando
   cambia el almacén)
```

---

### 4.5 Flujo completo de una operación

Ejemplo: el usuario crea un objeto nuevo desde el formulario.

```
1.  Usuario llena el formulario y hace clic en "Crear Objeto"
         │
2.  FormularioObjeto.vue emite evento @guardar con los datos
         │
3.  VistaInventario.vue llama a almacenInventario.crearObjeto(datos)
         │
4.  almacenInventario.js llama a servicioInventario.crear(datos)
         │
5.  servicios.js hace POST /api/inventario con axios
         │ (HTTP)
6.  rutasInventario.js recibe la petición → llama controladorInventario.crear()
         │
7.  controladorInventario extrae req.body → llama ServicioInventario.crearObjeto()
         │
8.  ServicioInventario valida los datos y llama RepositorioInventario.crear()
         │
9.  RepositorioInventario escribe el nuevo objeto en inventario.json
         │
10. La respuesta sube por todas las capas hasta Vue
         │
11. almacenInventario agrega el objeto al array reactivo
         │
12. Vue actualiza la tabla automáticamente sin recargar la página
         │
13. Se muestra una notificación verde: "Objeto creado exitosamente"
```

---

## 5. Estructura de Carpetas

```
sistema-inventario-ageso/
│
├── 📄 iniciar.bat                        ← Script de inicio para Windows
├── 📄 .gitignore                         ← Archivos que Git debe ignorar
│
├── 📁 servidor/                          ← Backend: Node.js + Express
│   ├── 📄 package.json                   ← Dependencias del servidor
│   ├── 📄 .env.ejemplo                   ← Plantilla de configuración
│   │
│   ├── 📁 datos/                         ← Base de datos (archivos JSON)
│   │   ├── inventario.json
│   │   ├── traslados.json
│   │   ├── calibraciones.json
│   │   └── checklist.json
│   │
│   ├── 📁 temp/                          ← Archivos temporales de importación
│   │
│   └── 📁 src/
│       ├── 📄 app.js                     ← Punto de entrada del servidor
│       │
│       ├── 📁 configuracion/
│       │   └── configuracion.js          ← Constantes globales (puerto, rutas, categorías)
│       │
│       ├── 📁 modelos/
│       │   ├── ObjetoInventario.js       ← Clase con la forma y lógica del objeto
│       │   └── otrosModelos.js           ← Traslado, Calibracion, ItemChecklist
│       │
│       ├── 📁 repositorios/
│       │   ├── RepositorioBase.js        ← CRUD genérico con JSON (leer, escribir, actualizar, eliminar)
│       │   ├── RepositorioInventario.js  ← Búsquedas y estadísticas específicas
│       │   └── otrosRepositorios.js      ← RepositorioTraslados, Calibraciones, Checklist
│       │
│       ├── 📁 servicios/
│       │   ├── ServicioInventario.js     ← Lógica de negocio del inventario
│       │   ├── ServicioImportExport.js   ← Importar/exportar Excel y CSV
│       │   └── otrosServicios.js         ← ServicioTraslados, Calibraciones, Checklist
│       │
│       ├── 📁 controladores/
│       │   └── index.js                  ← Todos los controladores (uno por módulo)
│       │
│       ├── 📁 rutas/
│       │   ├── rutasInventario.js        ← GET/POST/PUT/DELETE /api/inventario
│       │   ├── rutasTraslados.js         ← /api/traslados
│       │   └── otrasRutas.js             ← Calibraciones, Checklist, ImportExport
│       │
│       └── 📁 utilidades/
│           ├── generadorId.js            ← Genera IDs únicos (OBJ_xxx, TRA_xxx)
│           ├── manejadorErrores.js       ← Captura errores globales de Express
│           ├── respuestaHttp.js          ← Formato estándar para todas las respuestas
│           └── validadores.js            ← Funciones de validación por entidad
│
└── 📁 cliente/                           ← Frontend: Vue 3 + Vite
    ├── 📄 package.json
    ├── 📄 index.html                     ← HTML raíz (Vue se monta aquí)
    ├── 📄 vite.config.js                 ← Configuración de Vite + proxy a la API
    │
    └── 📁 src/
        ├── 📄 main.js                    ← Punto de entrada de Vue
        ├── 📄 App.vue                    ← Componente raíz (navbar + RouterView + toasts)
        │
        ├── 📁 enrutador/
        │   └── indice.js                 ← Definición de rutas del frontend
        │
        ├── 📁 almacen/                   ← Estado global con Pinia
        │   ├── almacenInventario.js      ← Estado y acciones del inventario
        │   └── almacenesSecundarios.js   ← Notificaciones y Traslados
        │
        ├── 📁 servicios/
        │   └── servicios.js              ← Axios + todos los servicios HTTP
        │
        ├── 📁 utilidades/
        │   └── utilidades.js             ← Formateo de fechas, constantes, clases CSS
        │
        ├── 📁 componentes/
        │   ├── comunes/
        │   │   ├── InsigniaEstado.vue    ← Badge de color para estados
        │   │   └── ModalConfirmacion.vue ← Modal de confirmación reutilizable
        │   ├── inventario/
        │   │   └── FormularioObjeto.vue  ← Formulario crear/editar objeto
        │   └── traslados/
        │       └── FormularioTraslado.vue
        │
        └── 📁 vistas/
            ├── VistaDashboard.vue
            ├── VistaInventario.vue
            ├── VistaTraslados.vue
            ├── VistaCalibraciones.vue
            └── VistaChecklist.vue
```

---

## 6. Cómo Funciona por Dentro

### 6.1 La API REST

El servidor expone los siguientes endpoints. Todos devuelven JSON en el formato estándar:

```json
{
  "exito": true,
  "mensaje": "Operación exitosa",
  "datos": { ... }
}
```

**Inventario:**
```
GET    /api/inventario              → Lista todos los objetos
GET    /api/inventario/buscar       → Busca con filtros (?texto=...&categoria=...&estado=...)
GET    /api/inventario/estadisticas → Totales para el dashboard
GET    /api/inventario/:id          → Obtiene un objeto por ID
POST   /api/inventario              → Crea un objeto nuevo
PUT    /api/inventario/:id          → Actualiza un objeto
DELETE /api/inventario/:id          → Elimina un objeto
```

**Traslados:**
```
GET    /api/traslados               → Lista todos los traslados
GET    /api/traslados/objeto/:id    → Historial de un objeto específico
POST   /api/traslados               → Registra un traslado
```

**Calibraciones:**
```
GET    /api/calibraciones           → Lista todas las calibraciones
GET    /api/calibraciones/objeto/:id → Historial de un objeto específico
POST   /api/calibraciones           → Registra una calibración
```

**Checklist:**
```
GET    /api/checklist               → Lista todos los ítems
GET    /api/checklist/resumen       → Resumen del último control
POST   /api/checklist               → Registra un ítem de control
```

**Importar / Exportar:**
```
POST   /api/importar-exportar/importar/excel  → Sube un archivo .xlsx
POST   /api/importar-exportar/importar/csv    → Sube un archivo .csv
GET    /api/importar-exportar/exportar/excel  → Descarga inventario.xlsx
GET    /api/importar-exportar/exportar/csv    → Descarga inventario.csv
```

### 6.2 Sistema de notificaciones

El sistema tiene un almacén global `useAlmacenNotificaciones` (Pinia) que cualquier componente puede usar para mostrar mensajes en pantalla:

```javascript
notif.agregar('Objeto creado exitosamente', 'success');  // Verde
notif.agregar('Error al guardar',           'danger');   // Rojo
notif.agregar('Calibración próxima a vencer','warning'); // Amarillo
```

Los mensajes desaparecen solos después de 4 segundos.

### 6.3 Formato estándar de IDs

Todos los IDs generados tienen un prefijo que indica el tipo de registro:

| Prefijo | Entidad |
|---|---|
| `OBJ_` | Objeto de inventario |
| `TRA_` | Traslado |
| `CAL_` | Calibración |
| `CHK_` | Ítem de checklist |

Ejemplo: `OBJ_A1B2C3D4E5F6`

---

## 7. Control de Versiones

### v2.0.0 — Migración completa · Marzo 2026

**Cambios principales:**

Esta versión representa la migración completa desde Google Apps Script + Google Sheets a una aplicación web profesional con arquitectura MVC + Repository Pattern.

**Nuevo en esta versión:**
- ✅ Arquitectura completa separada en cliente y servidor
- ✅ API REST con Express (Node.js)
- ✅ Frontend con Vue 3 + Vite + Pinia + Vue Router
- ✅ Módulo de Inventario completo (CRUD + búsqueda + filtros)
- ✅ Módulo de Traslados con actualización automática de ubicación
- ✅ Módulo de Calibraciones con alertas de vencimiento
- ✅ Módulo de Checklist con sesiones de control y resumen
- ✅ Importación desde Excel (.xlsx) y CSV (.csv)
- ✅ Exportación a Excel (.xlsx) y CSV (.csv)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Sistema de notificaciones globales (toasts)
- ✅ Almacenamiento en archivos JSON (preparado para migrar a MySQL)
- ✅ Script de inicio rápido `iniciar.bat` para Windows
- ✅ Nomenclatura completa en español

---

### v2.0.1 — Corrección de bugs · Marzo 2026

**Bugs corregidos:**

- 🐛 `package.json` del cliente incluía `@pinia/nuxt`, que es exclusivo de Nuxt.js y causaba errores de instalación.
- 🐛 `App.vue` importaba desde `@/almacen/almacenNotificaciones` (archivo inexistente). Corregido a `almacenesSecundarios`.
- 🐛 `almacenInventario.js` importaba desde `@/servicios/servicioInventario` (archivo inexistente). Corregido a `servicios`.
- 🐛 `almacenesSecundarios.js` contenía imports duplicados con alias conflictivos. Reescrito limpio.

---

### v1.1.0 — Google Apps Script · Octubre 2025

Versión previa desarrollada sobre Google Sheets + Apps Script.

**Funcionalidades que tenía:**
- ✅ Inventario básico en Google Sheets
- ✅ Formularios HTML embebidos en modalDialog
- ✅ Dashboard con estadísticas
- ✅ Buscador de objetos
- ✅ Formulario de traslados
- ✅ Checklist de control (añadido en esta versión)
- ✅ Guía de nomenclatura
- ✅ Categorías de objetos
- ✅ Cantidad de etiquetas múltiples
- ✅ Control de calibraciones

**Limitaciones que motivaron la migración:**
- ❌ Dependencia total de internet y cuenta Google
- ❌ Sin control de versiones del código
- ❌ Sin pruebas automatizadas posibles
- ❌ Rendimiento limitado por la API de Google Sheets
- ❌ Difícil escalabilidad y mantenimiento
- ❌ Sin posibilidad de base de datos real

---

### v1.0.0 — Google Apps Script · Versión inicial

Primera versión funcional del sistema sobre Google Apps Script.

**Incluía:**
- ✅ Estructura básica de inventario
- ✅ Modelo de datos con clases JavaScript
- ✅ Repositorio base sobre Google Sheets
- ✅ Formularios de agregar y editar
- ✅ Módulo de calibraciones
- ✅ Módulo de traslados

---

## 8. Cómo Instalar y Ejecutar

### Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org) v18 o superior
- [VS Code](https://code.visualstudio.com) (recomendado)
- Git (opcional, para control de versiones)

### Instalación (primera vez)

```bash
# 1. Descomprime el proyecto y entra a la carpeta
cd sistema-inventario-ageso

# 2. Instala dependencias del servidor
cd servidor
npm install
cd ..

# 3. Instala dependencias del cliente
cd cliente
npm install
cd ..

# 4. Copia el archivo de configuración
copy servidor\.env.ejemplo servidor\.env
```

### Inicio rápido (Windows)

Haz doble clic en `iniciar.bat`. El script hace todo automáticamente.

### Inicio manual

Abre **dos terminales separadas**:

**Terminal 1 — Servidor:**
```bash
cd servidor
npm run desarrollo
# → Servidor corriendo en http://localhost:3000
```

**Terminal 2 — Cliente:**
```bash
cd cliente
npm run desarrollo
# → Cliente corriendo en http://localhost:5173
```

Luego abre el navegador en: **http://localhost:5173**

### Hoja de ruta futura (próximas versiones)

| Versión | Funcionalidad planeada |
|---|---|
| v2.1.0 | Migración de almacenamiento de JSON a MySQL |
| v2.2.0 | Sistema de usuarios y autenticación |
| v2.3.0 | Modo multi-usuario en red local (LAN) |
| v2.4.0 | Carga de imágenes por objeto |
| v2.5.0 | Módulo de reportes con gráficos avanzados |
| v3.0.0 | Despliegue en la nube (servidor remoto) |

---

*Documentación generada para Sistema de Inventario AGESO v2.0.1 · Marzo 2026*
