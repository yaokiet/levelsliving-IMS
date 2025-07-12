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
- Python >= 3.11.13 installed
For macOS (requires brew):
```bash
brew install python@3.11
```
OR for windows or macOS without brew installed: download and install directly from python website

## Set up
1. Create virtual environment
In the root folder:

```bash
python3.11 -m venv venv 
source venv/bin/activate
```

2. Select python interpreter in venv

For mac:
Press `cmd + shift + p`, search and click `Python: Select Interpreter` and select `Python 3.11.13 (venv) ./venv/bin/python`

For windows:
Press `Ctrl + shift + p`, search and click `Python: Select Interpreter` and select `Python 3.11.13 (venv) .\venv\Scripts\python.exe`

In the terminal run and ensure it displays `Python 3.11.13`:

```bash
python --version
```

3. Install dependencies

```bash
cd server              
pip install -r requirements.txt
```

## To Run
In the server folder

```bash
python -m app.main
```

To view api docs:
```bash
localhost:8000/docs
```
