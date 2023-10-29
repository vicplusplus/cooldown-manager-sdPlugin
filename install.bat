@echo off
setlocal enabledelayedexpansion

:: 1. Check if Python is installed and in PATH
python --version
if %errorlevel% neq 0 (
    echo.
    echo Please install Python from the official website:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANT: During installation, make sure to check the option to "Add Python to environment variables".
    echo.
    echo Once Python is installed with the above setting, please re-run this script.
    pause
    exit /b
)


:: 2. Download the streamdeck-javascript-sdk
echo Downloading streamdeck-javascript-sdk...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri https://github.com/elgatosf/streamdeck-javascript-sdk/archive/refs/heads/main.zip -OutFile %temp%\sdk.zip"

:: Extract the SDK
echo Extracting SDK...
powershell -Command "Expand-Archive -Path %temp%\sdk.zip -DestinationPath %temp%\sdk"

:: Move to the desired directory
if not exist "%~dp0src\com.vicplusplus.cooldown.sdPlugin\libs" mkdir "%~dp0src\com.vicplusplus.cooldown.sdPlugin\libs"
xcopy /s /y "%temp%\sdk\streamdeck-javascript-sdk-main\*" "%~dp0src\com.vicplusplus.cooldown.sdPlugin\libs"

:: Clean up temporary SDK files
del /Q "%temp%\sdk.zip"
rd /S /Q "%temp%\sdk"

:: 3. Install pip libraries
echo Installing pip libraries...
python -m pip install keyboard websockets -t "%~dp0src\cdmanager"

:: 4. Create a symbolic link
set "PluginDest=C:\Users\%username%\AppData\Roaming\Elgato\StreamDeck\Plugins\com.vicplusplus.cooldown.sdPlugin"
if not exist "%PluginDest%" (
    echo Creating symbolic link...
    mklink /D "%PluginDest%" "%~dp0src\com.vicplusplus.cooldown.sdPlugin"
    set "mklinkError=!errorlevel!"
    if !mklinkError! neq 0 (
        echo.
        echo Failed to create symbolic link. Please run this script as administrator.
        pause
        exit /b 1
    )
) else (
    echo.
    echo Symbolic link already exists.
    echo.
)

echo.
echo Installation completed! Quit an re-open Stream Deck for changes to apply.
pause
endlocal
