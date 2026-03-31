@echo off
REM ============================================================
REM  INICIO RAPIDO - Sistema de Inventario AGESO
REM  Ejecuta este archivo haciendo doble clic en Windows
REM ============================================================

echo.
echo  ====================================
echo   Sistema de Inventario AGESO v2.0
echo  ====================================
echo.

REM Verificar que Node.js está instalado
node --version >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERROR] Node.js no está instalado.
  echo Descárgalo desde: https://nodejs.org
  pause
  exit /b 1
)

REM Instalar dependencias si no existen
IF NOT EXIST "servidor\node_modules" (
  echo [1/2] Instalando dependencias del servidor...
  cd servidor && npm install && cd ..
)

IF NOT EXIST "cliente\node_modules" (
  echo [2/2] Instalando dependencias del cliente...
  cd cliente && npm install && cd ..
)

REM Copiar .env si no existe
IF NOT EXIST "servidor\.env" (
  copy "servidor\.env.ejemplo" "servidor\.env" >nul
  echo [OK] Archivo .env creado desde el ejemplo
)

echo.
echo [OK] Iniciando servidor en http://localhost:3000
echo [OK] Iniciando cliente en  http://localhost:5173
echo.
echo Abre tu navegador en: http://localhost:5173
echo (Presiona Ctrl+C en cualquier ventana para detener)
echo.

REM Abrir dos ventanas de terminal separadas
start "Servidor AGESO" cmd /k "cd servidor && npm run desarrollo"
timeout /t 2 /nobreak >nul
start "Cliente AGESO"  cmd /k "cd cliente  && npm run desarrollo"
