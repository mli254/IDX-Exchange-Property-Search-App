# IDX-Exchange-Property-Search-App
## Description
A property search application created for the IDX Exchange internship. Using real MLS data, the application displays multiple property listings via a grid of card elements. Users can filter the properties by city name, zipcode, minimum price, maximum price, number of beds, and number of baths. Clicking on a card will navigate to a separate page that provides more detailed information about the specific property, such as interior features, room types, and heating/cooling information. 

### Tech Stack:
- Backend
  - Node.js (ver. 24.16.0)
  - Express.js (ver. 5.2.1)
- Frontend
  - React (ver. 19.2.7)
  - TailwindCSS (ver. 4.3.3)
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

### React / Vite Setup
React is used for the frontend, created via Vite and with `npm` as a package manager as well. If creating the project from scratch, run:

```bash
npm create vite@latest frontend 
```
With `frontend` becoming the folder that holds your React app. From there, the Command Line will present several configuration options. Select `React` and then `JavaScript`.

### SQL Setup
To speed up database queries, indexes are created on commonly accessed columns:

```sql
CREATE INDEX idx_zipcode ON rets_property (L_Zip);
CREATE INDEX idx_price ON rets_property (L_SystemPrice);
CREATE INDEX idx_beds ON rets_property (L_Keyword2);
CREATE INDEX idx_baths ON rets_property (LM_Dec_3);
CREATE INDEX idx_city_price ON rets_property ((LOWER(TRIM(L_City))), L_SystemPrice);
```
### `EXPLAIN` for SQL query performance
The `EXPLAIN` or `EXPLAIN ANALYZE` commands can be used to check the performance of a given query. This information
can be used to inform additional indexes on commonly accessed rows. For example, for a complex query such as:
```bash
SELECT * from rets_property where LOWER(TRIM(L_City))=LOWER(TRIM("Santa Cruz")) and L_SystemPrice >= 1000 and L_SystemPrice <= 1000000 and L_Zip = "95060" and L_Keyword2 = 2 and LM_Dec_3 = 1 order by ListingContractDate ASC, L_ListingID ASC;
```
The `EXPLAIN` command returns:
| id | select_type | table | partitions | type | possible_keys | key | key_len | ref | rows | filtered | Extra |
|----|-------------|-------|------------|------|---------------|-----|---------|-----|------|----------|-------|
| 1 | SIMPLE | rets_property | NULL | index_merge | idx_L_Zip,idx_zipcode,idx_price,idx_beds,idx_baths idx_city_price | idx_L_Zip,idx_baths | 83,4 | NULL | 9 | 2.27 | Using intersect(idx_L_Zip,idx_baths); Using where; Using filesort |

* `id` — represents the step number in the execution plan.
* `select_type` — categorizes the type of select query based on complexity; since the query only selected all rows using '*', it is classified as a `SIMPLE` query. 
* `table` — name of the table used in the query.
* `partitions` — shows the number of partitions in the table used in the query.
* `type` — specifies the access type; if no indexes were present, the type would be `ALL`, indicating a full table scan, but here it indicates that indexes were used.
* `possible_keys` — possible keys/indexes that could have been used in the query.
* `keys_used` — the actual keys/indexes used in the query.
* `key_len` — the length of the keys used
* `ref` — specifies any references used while comparing columns.
* `rows` — number of rows examined by the query
* `filtered` — number of rows filtered using conditions in the `WHERE` clause.
* `Extra` — any extra information regarding the query.

`EXPLAIN ANALYZE` further informs us that the query took a total of 28.7 milliseconds.

Using this information, we can create an additional composite index, and run the commands again.
```sql
CREATE INDEX idx_zip_baths ON rets_property (L_Zip, LM_Dec_3);
```

| id | select_type | table | partitions | type | possible_keys | key | key_len | ref | rows | filtered | Extra |
|----|-------------|-------|------------|------|---------------|-----|---------|-----|------|----------|-------|
| 1 | SIMPLE | rets_property | NULL | ref | idx_L_Zip,idx_zipcode,idx_price,idx_beds,idx_baths,idx_zip_baths,idx_city_price | idx_zip_baths | 87 | const, const | 8 | 2.50 | Using where; Using filesort |

Running `EXPLAIN ANALYZE` again shows a slight improvement to 24.7 milliseconds.

Additionally, the output of `EXPLAIN ANALYZE` also provides a tree view of the query process. In reviewing the output, we can see that the sorting of the data is a process that takes a significant chunk of time. As a result, if we add another index on the column being used in the `ORDER BY` command:

```sql
CREATE INDEX idx_listingdate ON rets_property (ListingContractDate);
```

Running `EXPLAIN ANALYZE` again shows that the total duration has dropped significantly, down to 1.63 milliseconds. This can be repeated for another field that is used to sort the rows, namely the square footage, as price, number of beds, and the listing ID (default) already have indexes. 

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

### 3. React.js
```bash
cd frontend
npm install
npm run dev
```
The application should start on `http://localhost:3000`.

## API
### `GET /api/health`
Checks the status of the database connection. 

| Condition | Status | Response |
|-----------|--------|----------|
| Database Connected | `200` | `{status: "ok", database: "connected"}` |
| Database Disconnected | `500` | `{status: "internal server error", database: "disconnected", error: [error message] }` |

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
- `sortBy`
    - `string` that represents a field by which to sort the data; only accepts the following as valid params: default, price, date-listed, square-footage, and beds
- `sortOrder`
    - `string` that determines whether to sort the data in ascending or descending order; only accepts "asc" or "desc"
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
| Invalid Parameter Type | `400` | `{status: "bad request", error: "Please ensure [parameter_name] parameter is a numeric whole number."}` |
| Invalid Parameter Range (Min) | `400` | `{status: "bad request", error: "Please ensure [parameter_name] parameter is greater than [min]"}` |
| Invalid Parameter Range (Max) | `400` | `{status: "bad request", error: "Please ensure [parameter_name] parameter is less than [max]"}` |
| Invalid Sort Field | `400` | `{status: "bad request", error: "[parameter_name] is not a valid parameter. For sorting, please choose one of: default, price, date-listed, square-footage, or beds."}` |

The `400` HTTP code refers to a bad request, which indicates an error on the client side. 

To access this endpoint:
```bash
curl http://localhost:5000/api/properties?limit=[num]&offset=[num]&sortBy=[field]&sortOrder=[asc/desc]&city=[city_name]&zipcode=[zipcode]&minPrice=[num]&maxPrice=[num]&beds=[num]&baths=[num]
```
Users should replace the placeholders in brackets, and only including the parameters needed, as all are optional.

### `GET /api/properties/:id`
An endpoint that, given a property's ID, returns all the data associated with that property.

| Condition | Status | Response |
|-----------|--------|----------|
| Success | `200` | `{ "results": [...] }`
| Invalid Parameter Type | `400` | `status: "bad request", error: "Please ensure listing ID is numeric."`
| Invalid Parameter Range | `400` | `status: "bad request", error: "Please ensure listing ID is between 100000000 and 9999999999."`
| Unknown Property ID | `404` | `status: "not found", error: "No listing was found for ID [id]."`

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
| Invalid Parameter Type | `400` | `status: "bad request", error: "Please ensure listing ID is numeric."`
| Invalid Parameter Range | `400` | `status: "bad request", error: "Please ensure listing ID is between 100000000 and 9999999999."`
| Unknown Property ID | `404` | `status: "not found", error: "No listing was found for ID [id]."`

To access the endpoint:

```bash
curl http://localhost:5000/api/properties/[id]/openhouses
```