# levelsliving-IMS

monorepo with client and server with single CI pipeline for deploying into digital ocean

TODO:

- set up docker CI
- set up db in backend
- set up routes and services path in server

Git Commands:

- clone repo (git clone (paste here....))
- git add .
- git commit -m "message"
- git push origin
- git pull origin

# Client

## Pre-requisites

- Node.js installed
  For macOS (requires brew):

```bash
brew install node
```

OR for windows or macOS without brew installed: download and install directly from Node.js website

## Set up

In client folder:

```bash
npm i
```

## To Run

In client folder:

```bash
npm run dev
```

# Server

## Pre-requisites

- Python >= 3.9.12 installed

For macOS (requires brew):

```bash
brew install pyenv
pyenv install 3.9.12
```

Press `cmd + shift + p`, search and click `Python: Select Interpreter`, select `Python 3.9.12 (3.9.12) ~/.pyenv/versions/3.9.12/bin/python` and restart your terminal

OR for windows or macOS without brew installed: download and install directly from python website

## Set up

Ensure you're using python 3.9.12

1. Create virtual environment

In the root folder:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Select python interpreter in venv

For mac:
Press `cmd + shift + p`, search and click `Python: Select Interpreter` and select `Python 3.9.12 (venv) ./venv/bin/python`

For windows:
Press `Ctrl + shift + p`, search and click `Python: Select Interpreter` and select `Python 3.9.12 (venv) .\venv\Scripts\python.exe`

In the terminal run and ensure it displays `Python 3.9.12`:

```bash
python --version
```

3. Install dependencies

```bash
cd server
pip install -r requirements.txt
```

OR set up the environment manually by:

Press `cmd + shift + p`, search and click `Python: Select Interpreter` > `+ Create Virtual Environment` > `Venv` > `Python 3.9.12` > check `server/requirements.txt` > `OK`

## To Run

Ensure that .venv is activated

In the server folder

```bash
python -m app.main
```

To view api docs:

```bash
localhost:8000/docs
```

# Database & Admin UI Setup

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

---

### 1. Start the Database and Admin UI

From the `server` directory, run:

```bash
docker-compose up
```

This will start:

- **PostgreSQL** database (service name: `db`)
- **pgAdmin 4** web UI (service name: `pgadmin`)


If you encounter an error e.g. **Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5432 -> 0.0.0.0:0: listen** then you need to go to **Terminal as an admin** 
- net stop winnat
Before you docker-compose up
---

### 2. Access pgAdmin 4 Web UI

- Open your browser and go to: [http://localhost:5050](http://localhost:5050)
- **Login credentials:**
  - Email: `admin@admin.com`
  - Password: `admin`

---

### 3. Connect pgAdmin to the Database

After logging in to pgAdmin:

1. Click **"Add New Server"** (or right-click "Servers" → "Create" → "Server...").
2. **General tab:**
   - Name: `LevelsLiving` (or any name you prefer)
3. **Connection tab:**
   - Host name/address: `db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `password`
   - Maintenance database: `levelsliving` (or leave as `postgres` to see all DBs)
4. Click **Save**.

You should now see the `levelsliving` database and any tables created by the initialization scripts.

---

### 4. Checking Tables and Running SQL

- In pgAdmin, expand `Servers` → your server → `Databases` → `levelsliving` → `Schemas` → `public` → `Tables` to see your tables.
- To run SQL queries, right-click the `levelsliving` database and select **Query Tool**.  
  Example:
  ```sql
  SELECT * FROM user;
  ```

---

### 5. Resetting the Database (if needed)

Prerequisite:
- psql installed

For Mac:
```bash
brew install postgresql
```

For windows install from postgres website

Initial run (give execution permission to the migration scripts):

In the `server/init-scripts` directory:
```bash
chmod +x migrateup.sh migratedown.sh
```

If you are using windows you have to use Git Bash instead. chmod will **not** work

Subsequent runs:

To drop all tables:
```bash
./migratedown.sh
```

To create tables and seed db:
```bash
./migrateup.sh
```

---
