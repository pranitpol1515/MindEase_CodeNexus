@echo off
REM Activate virtual environment and start FastAPI server
cd /d "%~dp0"  REM change to backend directory
call .\.venv\Scripts\activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
