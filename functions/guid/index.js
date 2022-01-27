const { v4: uuidv4 } = require('uuid');
const { NestedPropertyAccessor } = C.expr;
const cLogger = C.util.getLogger('func:guid');

exports.disabled = 0;
exports.name = 'UUID Generator';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let dstField;

exports.init = (opt) => {
    conf = (opt || {}).conf || {};

    dstField = (conf.dstField || '').trim();
    if (dstField) {
        dstField = new NestedPropertyAccessor(dstField);
    }
};

exports.process = (event) => {
    try {
        let data = uuidv4();
        dstField.set(event, data);
    } catch (err) {
        cLogger.error("Unable to generate uuid!", {err})
    }

    return event;
};
