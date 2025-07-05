@echo off
echo Verifica stato Ollama...
echo.

:: Test se Ollama risponde
curl -s http://localhost:11434/api/tags > nul 2>&1
if %errorlevel%==0 (
    echo ✅ Ollama è ATTIVO e risponde
    echo.
    echo Modelli disponibili:
    curl -s http://localhost:11434/api/tags | findstr "name"
) else (
    echo ❌ Ollama NON risponde
    echo.
    echo Soluzioni:
    echo 1. Avvia Ollama con: ollama serve
    echo 2. Oppure installa Ollama da: https://ollama.ai
    echo 3. Verifica che la porta 11434 sia libera
)

echo.
echo Premi un tasto per chiudere...
pause > nul
