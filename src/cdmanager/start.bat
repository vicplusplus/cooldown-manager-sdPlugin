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

:: Run the script using Python
python "%script%"

endlocal