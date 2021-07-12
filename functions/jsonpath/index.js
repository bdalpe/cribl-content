const {JSONPath} = require('jsonpath-plus');
const {NestedPropertyAccessor} = C.expr;
const cLogger = C.util.getLogger('func:jsonpath');

exports.disabled = 0;
exports.name = 'JSONPath';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let srcField = '_raw';
let dstField;
let overwrite = false;

exports.init = (opt) => {
    conf = (opt || {}).conf || {};

    srcField = new NestedPropertyAccessor((conf.srcField || '_raw').trim());
    dstField = (conf.dstField || '').trim();
    if (dstField) {
        dstField = new NestedPropertyAccessor(dstField);
    }

    overwrite = conf.overwrite || false;
};

exports.process = (event) => {
    try {
        // Auto-extract JSON data if not an object
        const data = (typeof srcField.get(event) !== 'object') ? JSON.parse(srcField.get(event)) : srcField.get(event);
        const value = JSONPath({path: conf.jsonPathExpr, json: data});

        // "borrowed" from regex extract function
        const currentValue = dstField.get(event);
        if (!overwrite && currentValue !== undefined) {
            // Field exists on event which means we are dealing with an MV field extraction.
            if (Array.isArray(currentValue)) {
                // Field is already array, add the newly extracted value.
                currentValue.push(...value);
                dstField.set(currentValue);
            } else {
                // field is currently name=value, extract current value and convert to array.
                dstField.set(event, [currentValue, ...value]);
            }
        } else {
            dstField.set(event, value);
        }
    } catch (err) {
        cLogger.error("Unable to process JSONPath function!", {err})
    }
    return event;
}
