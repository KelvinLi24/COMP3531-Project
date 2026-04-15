@echo off
setlocal
cd /d "%~dp0"

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm.cmd not found. Please install Node.js and restart.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo Starting Vite dev server...
start "LingMao Dev Server" cmd /k "cd /d ""%cd%"" && npm.cmd run dev"

echo Opening browser...
start "" "http://localhost:5173"

echo Done.

endlocal
