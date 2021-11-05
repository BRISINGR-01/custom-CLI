@echo off
set basedir="%~dp0/../"

node "%basedir%/cli.js" %cd% %*

exit 0