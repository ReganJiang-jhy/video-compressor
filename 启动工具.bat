@echo off
rem 切换到UTF-8代码页
chcp 65001 >nul
rem 兼容GBK默认环境的特殊处理
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
  rem 使用适合64位系统的编码方式
  call :UTF8_ECHO "视频压缩工具 - 启动程序 (64位)"
) else (
  call :UTF8_ECHO "视频压缩工具 - 启动程序 (32位)"
)
title 视频压缩工具

rem 确保在脚本所在目录执行
cd /d "%~dp0"

call :UTF8_ECHO "============================================="
call :UTF8_ECHO "          视频压缩工具 - 服务器启动"
call :UTF8_ECHO "============================================="
echo.
call :UTF8_ECHO "正在检查环境并启动服务器..."
echo.

rem 检查node_server.js文件
if not exist "node_server.js" (
  call :UTF8_ECHO "[错误] 找不到node_server.js文件!"
  call :UTF8_ECHO "请确认该文件存在于当前目录。"
  goto error
)

rem 检查并使用Node.js
node --version >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  call :UTF8_ECHO "[√] 检测到Node.js，版本:"
  node --version
  echo.
  call :UTF8_ECHO "正在启动服务器..."
  echo.
  call :UTF8_ECHO "服务器启动后将自动打开浏览器"
  call :UTF8_ECHO "请保持此窗口开启，关闭窗口将停止服务器"
  call :UTF8_ECHO "============================================="
  
  rem 延迟1秒再打开浏览器，确保服务器先启动
  ping 127.0.0.1 -n 2 >nul
  start http://localhost:8080
  
  rem 启动Node.js服务器
  node node_server.js
  
  if %ERRORLEVEL% NEQ 0 (
    echo.
    call :UTF8_ECHO "[!] Node.js服务器启动失败，错误代码: %ERRORLEVEL%"
    goto error
  )
) else (
  call :UTF8_ECHO "[!] 未找到Node.js，请确保正确安装。"
  echo.
  call :UTF8_ECHO "您可以从 https://nodejs.org/ 下载安装"
  echo.
  goto error
)

goto end

:error
echo.
call :UTF8_ECHO "============================================="
call :UTF8_ECHO "                启动失败"
call :UTF8_ECHO "============================================="
echo.
call :UTF8_ECHO "请尝试以下解决方法:"
call :UTF8_ECHO " 1. 确保正确安装Node.js并添加到PATH环境变量"
call :UTF8_ECHO " 2. 以管理员身份运行此脚本"
call :UTF8_ECHO " 3. 尝试直接运行node命令:"
call :UTF8_ECHO "    node node_server.js"
echo.
call :UTF8_ECHO "技术支持:"
call :UTF8_ECHO " - 请确保node_server.js文件存在"
call :UTF8_ECHO " - 尝试使用其他启动方式"
echo.

:end
echo.
call :UTF8_ECHO "按任意键退出..."
pause >nul
exit /b 0

:UTF8_ECHO
echo %~1
exit /b 0 