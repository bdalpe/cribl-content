# Cribl Content

## Cribl Stream Content

### Collectors

* [MySQL](collectors/mysql/README.md)
* [Microsoft SQL](collectors/mssql/README.md)

### Functions

* [Array Iterator](functions/iterator/README.md) (obsolete - use the Code function starting in version 3.1)
* [JSONPath](functions/jsonpath/README.md)
* [HMAC Hashing](functions/hmac/README.md) (obsolete - added in version 3.1.2)
* [HTML Entities](functions/html_entities/README.md)
* [GUID/UUID Generator](functions/guid/README.md) 

## Building Content

This project uses Webpack to compile the `node_modules` and Cribl code into a single `index.js` file. To compile, run the following commands:

```bash
npm install
npm run build
```

This will run `npm install` in all subdirectories and then package each item into the `dist` folder.

To run subsequent builds, you can execute:

```bash
npm run build:webpack
```