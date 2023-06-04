## Foreground Service requires prebuild to modify manifest

1. npx expo prebuild
2. node node_modules/@supersami/rn-foreground-service/postinstall.js
3. npx expo run:android
