@echo off
echo Starting TimeSheet Local Server...
cd /d "%~dp0"
npx serve -l 3000 .
