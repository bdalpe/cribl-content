const sql = require('mssql');
const stringify = require('csv-stringify');
const { Expression } = C.expr;

exports.name = 'Microsoft SQL';
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

exports.init = async (opts) => {
    conf = opts.conf || {};
    connection = sql.connect(getConnectionString(conf));
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
        const promiseErrorHandler = (error) => {
            job.reportError(error).catch(() => {});
            return reject(error);
        }

        connection.then(c => {
            const errorHandler = (error) => {
                c.close();
                promiseErrorHandler(error);
            }

            sql.on('error', errorHandler);

            const request = c.request();
            const s = request.toReadableStream();
            s.pipe(stringifier);
            request.query(q);

            request.on('error', errorHandler);
            request.on('done', () => {
                c.close();
            })

            s.on('error', errorHandler);
            c.on('error', errorHandler);

            resolve(stringifier);
        }).catch(promiseErrorHandler);
    });
}
