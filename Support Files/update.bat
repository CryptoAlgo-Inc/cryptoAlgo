@echo off
IF %1==1 (
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
    curl -k -L "https://github.com/CryptoAlgo-Inc/cryptoAlgo/releases/download/v0.0.0/CryptoAlgo-Win.exe" -O || echo Installation failed. Did you give the updater admin permissions? & EXIT 1
    ECHO [INFO]: Download complete
    ECHO [INFO]: Stopping any instances of CryptoAlgo
    TASKKILL /f /im CryptoAlgo-GUI.exe> NUL
    ECHO [INFO]: Deleting previous CryptoAlgo version (your data will not be lost)
    DEL /f CryptoAlgo-GUI.exe /q > NUL
    ECHO [INFO]: Renaming downloaded file
    REN CryptoAlgo-Win.exe CryptoAlgo-GUI.exe > NUL
    ECHO [INFO]: Starting CryptoAlgo...
    START /b CryptoAlgo-GUI.exe & EXIT 0
    ECHO [INFO]: Deleting updater
    DEL "%~f0" & EXIT 0
) ELSE (
    ECHO ###########################################################################
    ECHO " ,-----.                        ,--.           ,---.  ,--.               "
    ECHO "'  .--./,--.--.,--. ,--.,---. ,-'  '-. ,---.  /  O  \ |  | ,---.  ,---.  "
    ECHO "|  |    |  .--' \  '  /| .-. |'-.  .-'| .-. ||  .-.  ||  || .-. || .-. | "
    ECHO "'  '--'\|  |     \   ' | '-' '  |  |  ' '-' '|  | |  ||  |' '-' '' '-' ' "
    ECHO " `-----'`--'   .-'  /  |  |-'   `--'   `---' `--' `--'`--'.`-  /  `---'  "
    ECHO "               `---'   `--'                               `---'          "
    ECHO ###########################################################################
    ECHO #             Please allow admin permissions when prompted                #
    powershell -command "Start-Process %0 1 -Verb runas"
    ECHO #                          Starting update...                             #
    ECHO #           Please do not close the other window that appears             #
    ECHO ###########################################################################
    ECHO #                    You can close this window now                        #
    ECHO #        Please do not use your computer during the update process        #
    ECHO #              Thank you for using the CryptoAlgo updater!                #
    ECHO ###########################################################################
    TIMEOUT 30
    EXIT 0
)