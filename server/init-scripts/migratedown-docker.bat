@echo off
REM Docker-based migration down script for Windows
REM This uses the PostgreSQL client inside the Docker container

echo Running migration down script using Docker...

docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS cart_item CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS cart CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS user_session CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS order_item CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS \"order\" CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS purchase_order_item CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS purchase_order CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS item_component CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS supplier_item CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS item CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS supplier CASCADE;"
docker exec server-db-1 psql -U postgres -d levelsliving -c "DROP TABLE IF EXISTS \"user\" CASCADE;"

echo Migration down completed successfully!
