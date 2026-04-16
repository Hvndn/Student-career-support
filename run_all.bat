@echo off
color 0A
echo =========================================
echo    STARTING STUDENT CAREER SUPPORT
echo =========================================
echo.

echo [1/2] Starting Backend (Spring Boot)...
cd jobportal
start /b mvnw.cmd spring-boot:run
cd ..

echo [2/2] Starting Frontend (React/Vite)...
cd frontend
start /b npm run dev
cd ..

echo.
echo Both services are running in the background of THIS terminal!
echo Output will be mixed here. (Note: To completely stop them later, you might need to close this terminal tab or kill the processes).

