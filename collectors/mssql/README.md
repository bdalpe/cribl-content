# Microsoft SQL Collector

This is a proof of concept collector that can run queries against a Microsoft SQL database. It is written in 100% JavaScript.

## Connection String

To run the collector, you will need to build a connection string to connect to the database.

Microsoft documentation for connection string properties: https://docs.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection.connectionstring?view=dotnet-plat-ext-6.0

### Example Connection String

An example connection string used during development of this collector:

```
Server=db.example.com,1433;Database=test;Integrated Security=false;User ID=SERVER\Administrator;Password=xxx;Encrypt=true;TrustServerCertificate=true;
```