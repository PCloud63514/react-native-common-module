@ECHO off

IF EXIST "./%1\" (
	rmdir /s /q %1
)