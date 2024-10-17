const fs = require('fs');


let _is_rbpi = null;
function isRBPI() {
    if(_is_rbpi === null) {
        _is_rbpi = fs.existsSync('/proc/device-tree/model');
    }
    return _is_rbpi;
}

module.exports = isRBPI;

