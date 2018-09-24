REM Call.cmd
@echo off
COLOR 8F
echo -- today is %date%.

echo -- auto start nodemon.
echo -- this function starts the music bot automatically when changes are made, for example, in the setting.
echo -----------------------------------------------

call nodemon index.js
