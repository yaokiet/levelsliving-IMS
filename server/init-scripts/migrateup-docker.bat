@echo off
REM Docker-based migration up script for Windows
REM This uses the PostgreSQL client inside the Docker container

echo Running migration up script using Docker...

echo Creating database tables from init.sql...
docker exec -i server-db-1 psql -U postgres -d levelsliving < init.sql

if %errorlevel% neq 0 (
    echo Error: Failed to execute init.sql
    exit /b 1
)

echo Seeding database with initial data from seed.sql...
docker exec -i server-db-1 psql -U postgres -d levelsliving < seed.sql

if %errorlevel% neq 0 (
    echo Error: Failed to execute seed.sql
    exit /b 1
)

echo Migration up completed successfully!
echo Database tables created and seeded with initial data.
