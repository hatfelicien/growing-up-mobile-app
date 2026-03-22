@echo off
echo Creating EAS project and building APK...
echo.
echo Step 1: Creating EAS project
echo y | eas project:init
echo.
echo Step 2: Building APK
eas build --platform android --profile preview --non-interactive
echo.
echo Build started! Check https://expo.dev for progress
pause
