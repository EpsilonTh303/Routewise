@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.18 or newer is required. Install Node.js, then run this file again.
  pause
  exit /b 1
)
node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||major===22&&minor>=18?0:1)"
if errorlevel 1 (
  echo Node.js 22.18 or newer is required.
  pause
  exit /b 1
)
if not exist "node_modules\next\dist\bin\next" (
  echo Dependencies are missing. Run npm ci and npm run db:generate in this folder first.
  echo For a new installation, also follow the database setup steps in README.md.
  pause
  exit /b 1
)
set "PORT=3001"
echo RouteWise: http://localhost:3001
echo Keep this window open. Press Ctrl+C to stop.
call npm.cmd run dev
set "ROUTEWISE_EXIT_CODE=%ERRORLEVEL%"
if not "%ROUTEWISE_EXIT_CODE%"=="0" pause
exit /b %ROUTEWISE_EXIT_CODE%
