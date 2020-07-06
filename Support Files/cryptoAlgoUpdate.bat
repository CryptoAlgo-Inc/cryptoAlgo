@echo off
if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)

REM Here's the main code
    REM So I need to do the admin stuff here
    REM So we bring the file back to the current dir
    cd %~dp0
    ECHO ###########################################################################
    ECHO " ,-----.                        ,--.           ,---.  ,--.               "
    ECHO "'  .--./,--.--.,--. ,--.,---. ,-'  '-. ,---.  /  O  \ |  | ,---.  ,---.  "
    ECHO "|  |    |  .--' \  '  /| .-. |'-.  .-'| .-. ||  .-.  ||  || .-. || .-. | "
    ECHO "'  '--'\|  |     \   ' | '-' '  |  |  ' '-' '|  | |  ||  |' '-' '' '-' ' "
    ECHO " `-----'`--'   .-'  /  |  |-'   `--'   `---' `--' `--'`--'.`-  /  `---'  "
    ECHO "               `---'   `--'                               `---'          "
    ECHO ###########################################################################
    ECHO #             Downloading the newest version of CryptoAlgo                #
    ECHO #     Please do not close this window until the download is complete      #
    curl -k -L "https://github.com/CryptoAlgo-Inc/cryptoAlgo/releases/download/v0.0.0/CryptoAlgo-Win.exe" -O
    ECHO [INFO]: Download complete
    ECHO [INFO]: Stopping any instances of CryptoAlgo
    TASKKILL /f /im CryptoAlgo-GUI.exe> NUL
    ECHO [INFO]: Deleting previous CryptoAlgo version (your data will not be lost)
    DEL /f CryptoAlgo-GUI.exe /q > NUL
    ECHO [INFO]: Renaming downloaded file
    REN CryptoAlgo-Win.exe CryptoAlgo-GUI.exe > NUL
    ECHO [INFO]: Starting CryptoAlgo...
    START CryptoAlgo-GUI.exe
    ECHO [INFO]: Deleting updater
    rem DEL "%~f0" & EXIT 0
pause