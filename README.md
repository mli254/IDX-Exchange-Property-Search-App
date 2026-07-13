# IDX-Exchange-Property-Search-App
## Description
A property search application created for the IDX Exchange internship.

### Tech Stack:
- Backend
  - Node.js / Express.js
- Frontend
  - React
- Database
  - MySQL 8 (Docker Container)

## Setup Instructions
### Docker Setup
To be able to query against a database, a MySQL 8 Docker container is used to store existing SQL data.

To initialize a MySQL 8 Docker container named `idx-mysql-local` on `port 3306`, with a database named `rets`:

```bash
$ docker run --name idx-mysql-local -p 3306:3306 -e MYSQL_ROOT_PASSWORD=[password] -e MYSQL_DATABASE=rets -d mysql:8.0
```
The result should be a Docker container that can be turned on and off. If using Docker Desktop, the container should appear in the UI as well. When running, it should appear when the `docker ps` command is run. 

To populate the container from an existing SQL file:

```bash
$ docker exec -i idx-mysql-local mysql rets -uroot -p'[password]' < [path to sql file]
```

Then, to run the container and enter any SQL commands:

```bash
$ docker exec -it idx-mysql-local bash mysql -uroot -p
```
The `-p` should prompt the database's password, after which users can enter SQL commands into the bash shell.

### NPM / Node.js Setup
Node.js is used for the backend, and along with it `npm` as a package manager. If creating the project from scratch, first create a `backend` folder, and then run:

```bash
npm init -y
npm install [dependency_name]
```

Otherwise, if forking the repository, the following command will download all dependencies:

```bash
cd backend
npm install
```

Currently, these include:
- nodemon 
    - allows use of `npm run dev`, which auto-restarts server on file changes
- mysql2/promise
    - able to establish `async` connections to a MySQL database 
- dotenv
    - used to store environment variables such as DB username/password in a single `.env` file. The `.env` file is not committed to GitHub.
- cors
    - provides security for cross-origin requests

### SQL Setup
To speed up database queries, indexes are created on commonly accessed columns:

## Running the App
### 1. Docker / SQL
```bash
docker start idx-mysql-local
```
Since the `.env` file used to store database credentials is not included in the repo, it will need to be created locally at `/backend/.env`:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=[password]
DB_NAME=rets
DB_PORT=3306
SERVER_PORT=5000
```
### 2. Node.js/Express
```bash
cd backend
npm install
npm run dev
```
Server should start on `http://localhost:5000`. 

## API
### `GET /api/health`
Checks the status of the database connection. 

| Condition | Status | Response |
|-----------|--------|----------|
| Database Connected | `200` | `{status: "ok", database: "connected"}` |
| Database Disconnected | `500` | `{status: "internal server error", database: "disconnected", message: [error message] }` |

The responses use the standard HTTP status codes, with `200` corresponding to success or "ok" and `500` corresponding to an internal server error. 

To access the endpoint:

```bash
curl http://localhost:5000/api/health
```

### `GET /api/properties`
A endpoint that allows for paginated filtering of the MySQL data using a variety of query parameters. 

Accepts the following filters:
- `limit`
    - an `integer` between 1-100; defaults to 20. 
- `offset`
    - an `integer` that dictates the number of rows to skip; defaults to 0. 
- `city`
    - `string` that ignores whitespace and is case-insensitive.
- `zipcode`
    - `string` type parameter
- `minPrice`
     - `integer` that dictates the lower price bound; cannot be less than 0.
- `maxPrice`
    - `integer` that dictates the upper price boundbound; cannot be less than 0.
- `beds`
    - `integer` that indicates the amount of beds in a property; cannot be less than 0.
- `baths`
    - `integer` that indicates the amount of baths in a property; cannot be less than 0.

| Condition | Status | Response |
|-----------|--------|----------|
| Successful Filtering | `200` | `{ "total": [num], "limit": [limit], "offset": [offset], "results": [ ... ] }` |
| Invalid Parameter | `400` | `{status: "bad request", message: invalid [param]: ...}` |

The `400` HTTP code refers to a bad request, which indicates an error on the client side. 

The server will output a descriptive error message if an invalid parameter is inputted, such as "limit exceeds range of 1-100". 

To access this endpoint:
```
curl http://localhost:5000/api/properties?limit=[num]&offset=[num]&city=[city_name]&zipcode=[zipcode]&minPrice=[num]&maxPrice=[num]&beds=[num]&baths=[num]
```
Replacing the placeholders in brackets, and only including the parameters needed, as all are optional.
