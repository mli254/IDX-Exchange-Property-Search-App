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
$ docker exec -it idx-mysql-local bash 
$ mysql -uroot -p
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

```sql
CREATE INDEX idx_zipcode ON rets_property (L_Zip);
CREATE INDEX idx_price ON rets_property (L_SystemPrice);
CREATE INDEX idx_beds ON rets_property (L_Keyword2);
CREATE INDEX idx_baths ON rets_property (LM_Dec_3);
CREATE INDEX idx_city_price ON rets_property ((LOWER(TRIM(L_City))), L_SystemPrice);
```

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
An endpoint that allows for paginated filtering of the MySQL data using a variety of query parameters. 

Accepts the following filters:
- `limit`
    - an `integer` between 1-100 that determines how many rows to display; defaults to 20. 
- `offset`
    - an `integer` that dictates the number of rows to skip; defaults to 0, and cannot be negative. 
- `city`
    - `string` that represents a city name; ignores surrounding whitespace and is case-insensitive.
- `zipcode`
    - `string` that represents a postal code.
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
| Successful Filtering | `200` | `{ "total": [count], "limit": [limit], "offset": [offset], "results": [ ... ] }` |
| Invalid Parameter Type | `400` | `{status: "bad request", message: "Please ensure [parameter_name] parameter is a numeric whole number."}` |
| Invalid Parameter Range (Min) | `400` | `{status: "bad request", message: "Please ensure [parameter_name] parameter is greater than [min]"}` |
| Invalid Parameter Range (Max) | `400` | `{status: "bad request", message: "Please ensure [parameter_name] parameter is less than [max]"}` |

The `400` HTTP code refers to a bad request, which indicates an error on the client side. 

To access this endpoint:
```bash
curl http://localhost:5000/api/properties?limit=[num]&offset=[num]&city=[city_name]&zipcode=[zipcode]&minPrice=[num]&maxPrice=[num]&beds=[num]&baths=[num]
```
Users should replace the placeholders in brackets, and only including the parameters needed, as all are optional.

### `GET /api/properties/:id`
An endpoint that, given a property's ID, returns all the data associated with that property.

| Condition | Status | Response |
|-----------|--------|----------|
| Success | `200` | `{ "results": [...] }`
| Invalid Parameter Type | `400` | `status: "bad request", message: "Please ensure listing ID is numeric."`
| Invalid Parameter Range | `400` | `status: "bad request", message: "Please ensure listing ID is between 100000000 and 9999999999."`
| Unknown Property ID | `404` | `status: "not found", message: "No listing was found for ID [id]."`

The `404` HTTP code refers to the "not found" error, where a requested resource could not be located by the server. 

To access the endpoint:

```bash
curl http://localhost:5000/api/properties/[id]
```

### `GET /api/properties/:id/openhouses`
An endpoint that returns all the openhouse events for a given property ID. If that property has no openhouse events, an empty array is returned.

| Condition | Status | Response |
|-----------|--------|----------|
| Success | `200` | `{ "openhouses": [...] }`
| Invalid Parameter Type | `400` | `status: "bad request", message: "Please ensure listing ID is numeric."`
| Invalid Parameter Range | `400` | `status: "bad request", message: "Please ensure listing ID is between 100000000 and 9999999999."`
| Unknown Property ID | `404` | `status: "not found", message: "No listing was found for ID [id]."`

To access the endpoint:

```bash
curl http://localhost:5000/api/properties/[id]/openhouses
```