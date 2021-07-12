const { runExprSafe, Expression, NestedPropertyAccessor } = C.expr;
const cLogger = C.util.getLogger('func:arrayiterator');

exports.disabled = 0;
exports.name = 'Array Iterator';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let srcField = '_raw';
let dstField;
let _expression = null;

exports.init = (opt) => {
    conf = (opt || {}).conf || {};

    srcField = new NestedPropertyAccessor((conf.srcField || '_raw').trim());
    dstField = (conf.dstField || '').trim();
    if (dstField) {
        dstField = new NestedPropertyAccessor(dstField);
    }

    const funcVal = conf.func || '';
    if (funcVal.length > 0) {
        _expression = new Expression(funcVal, { disallowAssign: true });
    }

    if (conf.type === 'reduce') {
        exports.process = reduce;
    } else if (conf.type === 'reduceRight') {
        exports.process = reduceRight;
    } else {
        exports.process = map;
    }
};

function map(event) {
    try {
        const value = srcField.get(event);
        if (Array.isArray(value)) {
            (dstField || srcField).set(event, value.map((element, index, arr) =>
                _expression.evalOn({element, index, arr})
            ));
        }
    } catch (err) {
        cLogger.error("Unable to run map function on data!", {err})
    }

    return event;
}

function reduce(event) {
    try {
        const value = srcField.get(event);
        if (Array.isArray(value)) {
            (dstField || srcField).set(event, value.reduce((accumulator, element, index, arr) =>
                    _expression.evalOn({accumulator, element, index, arr}),
                runExprSafe(conf.initialValue, {event})
            ));
        }
    } catch (err) {
        cLogger.error("Unable to run reduce function on data!", {err});
    }

    return event;
}

function reduceRight(event) {
    try {
        const value = srcField.get(event);
        if (Array.isArray(value)) {
            (dstField || srcField).set(event, value.reduceRight((accumulator, element, index, arr) =>
                    _expression.evalOn({accumulator, element, index, arr}),
                runExprSafe(conf.initialValue, {event})
            ));
        }
    } catch (err) {
        cLogger.error("Unable to run reduceRight function on data!", {err});
    }

    return event;
}

exports.process = map;
