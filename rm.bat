@ECHO off

IF EXIST "./%1\" (
	echo Yea FUCK
	rmdir /s /q %1
) else (
	echo FUCK
)