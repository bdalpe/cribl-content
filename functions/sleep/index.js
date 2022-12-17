exports.disabled = 0;
exports.name = 'Sleep';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let time = 0;

exports.init = (opt) => {
    conf = (opt || {}).conf || {};
    time = conf.time;
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

exports.process = (event) => {
    return sleep(time).then(() => event);
}
