
const isPi = require('detect-rpi');

let _skeletor_instance = null;

class Skeletor {

    static getInstance() {
        if (_skeletor_instance === null) {
            _skeletor_instance = new Skeletor();
        }
        return _skeletor_instance;
    }

    constructor() {
        this.name = 'Skeletor';

        this.onStep = 42;
        this.offStep = 255;



        if (isPi()) {

            const createPWM = require("./lib/createPWM");
            const i2cBus = require("i2c-bus");

            this.pwm = createPWM({
                i2c: i2cBus.openSync(1),
                address: 0x40,
                frequency: 50,
                debug: false
            });
        }
    }

    setOnStep(step) {
        this.onStep = step;
    }

    setOffStep(step) {
        this.offStep = step;
    }

    async test() {

        if (isPi()) {
            const pwm = await this.pwm;

            pwm.channelOn(4);
            pwm.setPulseLength(4, 1500);

            await new Promise((resolve, reject) => {
                pwm.setPulseRange(4, this.onStep, this.offStep, resolve);
            });
        } else {
            console.log(this.onStep, this.offStep);
        }


    }
}

module.exports = Skeletor;