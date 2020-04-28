# CryptoAlgo
This program allows you to encrypt messages and keys using the RSA and AES algorithms. The RSA algorithm is used to encrypt the AES keys, which is then transmitted to the receiver.

## Inner workings
1. User keys in the message to be encrypted.
2. Message is encrypted with AES.
3. AES keys are encrypted with RSA.
4. Encrypted AES keys are sent to receiver, with encrypted message.

Process is reversed to decrypt message.

## Download the latest stable version from GitHub releases!

### To feedback, please email me at (cryptoalgro@gmail.com)

Command to compile: pkg serverProduction.js --targets node13-win-x64 --config package.json