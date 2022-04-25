const mysql = require("mysql");
const stringify = require('csv-stringify');
const { Expression } = C.expr;

exports.name = 'MySQL';
exports.version = '0.1';
exports.disabled = false;
exports.destroyable = false;

let connection;
let query;
let conf;

exports.init = (opts) => {
    conf = opts.conf || {};
    if (conf.authType === "basic") {
        connection = mysql.createConnection({
            host: conf.server,
            user: conf.username,
            password: conf.password,
            database: conf.database
        })
    } else {
        connection = mysql.createConnection({
            host: conf.server,
            database: conf.database
        })
    }

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

    job.logger().debug("SQL Query", {query: q})

    return new Promise((resolve, reject) => {
        const errorHandler = (error) => {
            connection.destroy();
            job.reportError(error).catch(() => {});
            return reject(error);
        }

        connection.query(q)
        .stream({highWaterMark: 5})
        .on('error', errorHandler)
        .on('end', () => {
            connection.destroy();
        })
        .pipe(stringifier)
        .on('error', errorHandler);

        resolve(stringifier);
    });
}
