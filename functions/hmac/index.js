const crypto = require('crypto');
const { NestedPropertyAccessor } = C.expr;
const cLogger = C.util.getLogger('func:hmac');

exports.disabled = 0;
exports.name = 'HMAC Hash';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let srcField = '_raw';
let dstField;
let hashalg = 'sha256';
let secret;

exports.init = (opt) => {
    conf = (opt || {}).conf || {};

    srcField = new NestedPropertyAccessor((conf.srcField || '_raw').trim());
    dstField = (conf.dstField || '').trim();
    if (dstField) {
        dstField = new NestedPropertyAccessor(dstField);
    }

    hashalg = conf.hashalg;
    secret = conf.secret;
};

function generateHash(payload) {
    const hmac = crypto.createHmac(hashalg, secret);
    return hmac.update(payload).digest('hex');
}

exports.process = (event) => {
    try {
        let data = srcField.get(event);
        let hash = generateHash(data);
        dstField.set(event, hash);
    } catch (err) {
        cLogger.error("Unable to generate HMAC hash!", {err})
    }

    return event;
};
