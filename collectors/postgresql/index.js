const { Client } = require('pg');
const stringify = require('csv-stringify');
const QueryStream = require('pg-query-stream');
const { Expression } = C.expr;

exports.name = 'PostgreSQL';
exports.version = '0.1';
exports.disabled = false;
exports.destroyable = false;

let connection;
let query;
let conf;

const getConnectionString = (conf) => {
    if (conf.connectionStringType === "manual") {
        return conf.connectionString;
    } else if (conf.connectionStringType === "secret") {
        return C.Secret(conf.connectionStringSecret, 'text').value;
    } else {
        throw new Error("Unknown connection string type.");
    }
}

exports.init = (opts) => {
    conf = opts.conf || {};
    connection = new Client({connectionString: getConnectionString(conf)})
    connection.connect();

    query = new Expression(conf.query, { disallowAssign: true });
    return Promise.resolve();
}

exports.discover = async (job) => {
    // We need to "discover" a single task for collection.
    job.addResults([{}]);
}

exports.collect = async (collectible, job) => {
    const stringifier = stringify.stringify({header: true});
    const q = query.evalOn({earliest: conf.earliest, latest: conf.latest});

    job.logger().debug("SQL Query", {query: q});

    return new Promise((resolve, reject) => {
        const errorHandler = (error) => {
            connection.end();
            job.reportError(error).catch(() => {});
            return reject(error);
        }

        const query = new QueryStream(q);
        const stream = connection.query(query);

        stream.on('end', () => connection.end());
        stream.on('error', errorHandler);

        stream.pipe(stringifier)
            .on('error', errorHandler);

        resolve(stringifier);
    });
}
