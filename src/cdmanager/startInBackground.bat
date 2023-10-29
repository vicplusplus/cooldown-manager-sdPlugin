@echo off
setlocal

:: Define the python script to run
set "script=%~dp0main.py"

:: Check if the script exists
if not exist "%script%" (
    echo Error: main.py not found.
    pause
    exit /b 1
)

:: Run the script in the background using Python
start "" python "%script%"

echo WebSocket server is now running in the background...
pause
endlocal
