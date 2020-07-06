IF %1==1 (
    REM So I need to do the admin stuff here
    REM So we bring the file back to the current dir
    cd %~dp0
    curl -k -L "https://github.com/CryptoAlgo-Inc/cryptoAlgo/releases/download/v0.0.0/CryptoAlgo-Win.exe" -O || echo Installation failed. Did you give the updater admin permissions?
    start CryptoAlgo-GUI.exe
    pause
) ELSE (
    powershell -command "Start-Process %0 1 -Verb runas"
)