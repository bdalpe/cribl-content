# PostgreSQL Collector

This is a proof of concept collector that can run queries against a PostgreSQL database. It is written in 100% JavaScript.

## Installation

Run the following command:

```
npm install
```

Copy the contents of the `postgresql` folder to `$CRIBL_HOME/local/cribl/collectors/postgresql`.

Ensure Cribl Stream has been restarted for the new collector to appear.

## Configuration

Configure a new PostgreSQL collector.

## Query Configuration

Like the REST collector, you can use `earliest` and `latest` in the SQL query builder to limit events based on the time range provided in the job configuration.

For example, the following query would limit the number of rows to anything after the earliest time range specified.

```sql
`SELECT * FROM test WHERE timestamp > ${earliest * 1000}`
```

## Connection String

To run the collector, you will need to build a connection string to connect to the database.

More details and examples can be found here: https://github.com/brianc/node-postgres/tree/master/packages/pg-connection-string#usage

### Example Connection String

An example connection string used during development of this collector:

```
postgresql://postgres:password@localhost:5432/postgres
```
