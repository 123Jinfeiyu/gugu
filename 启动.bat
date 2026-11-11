@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 咕咕 · 消化小导游（关闭本窗口即停止服务）

echo.
echo   ============================================
echo    咕咕 · 消化小导游   AI 教学智能体
echo   ============================================
echo.
echo   正在启动本地服务（端口 8787），浏览器会自动打开。
echo   上课期间请保持这个窗口开着；下课后关掉窗口即可停止。
echo.

if not exist "secret.json" (
  echo   [警告] 没有找到 secret.json，DeepSeek 无法调用。
  echo   请在 secret.json 中填写：{"apiKey":"sk-..."}
  echo.
)

start "" powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:8787'"
node server.js

echo.
echo   服务已停止。按任意键关闭窗口。
pause >nul
