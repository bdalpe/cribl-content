# MySQL Collector

This is a proof of concept collector that can run queries against a MySQL database. It is written in 100% JavaScript.

## Installation

Run the following command:

```
npm install
```

Copy the contents of the `mysql` folder to `$CRIBL_HOME/local/cribl/collectors/mysql`.

Ensure Cribl Stream has been restarted for the new collector to appear.

## Configuration

Configure a new MySQL collector.

Enter the appropriate server and authentication details.

Like the REST collector, you can use `earliest` and `latest` in the SQL query builder to limit events based on the time range provided in the job configuration.

For example, the following query would limit the number of rows to anything after the earliest time range specified.

```sql
`SELECT * FROM test WHERE timestamp > ${earliest * 1000}`
```