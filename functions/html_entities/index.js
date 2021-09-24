const he = require('he');
const {NestedPropertyAccessor} = C.expr;
const cLogger = C.util.getLogger('func:html_entities');

exports.disabled = 0;
exports.name = 'HTML Entity Encode/Decode';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let srcField = '_raw';
let dstField;
let mode = 'decode';

exports.init = (opt) => {
    conf = (opt || {}).conf || {};

    srcField = new NestedPropertyAccessor((conf.srcField || '_raw').trim());
    dstField = (conf.dstField || '').trim();
    if (dstField) {
        dstField = new NestedPropertyAccessor(dstField);
    } else {
        // If dstField not set, overwrite srcField
        dstField = srcField;
    }

    mode = conf.mode || 'decode';
};

exports.process = (event) => {
    try {
        // Get text
        let text = srcField.get(event);

        // Encode or Decode depending on the selected mode
        text = mode === 'encode' ? he.encode(text, {'useNamedReferences': true}) : he.decode(text);

        // Set dstField with the result of the encoding or decoding
        dstField.set(event, text);
    } catch (err) {
        cLogger.error("Unable to process HTML Entity function!", {err})
    }
    return event;
}
