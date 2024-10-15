var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;

function createPWM(options) {
    return new Promise((resolve, reject) => {
        let pwm = new Pca9685Driver(options, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(pwm);
            }
        });
    });
}

module.exports = createPWM;