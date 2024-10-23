const fs = require("fs");
const isRBPI = require("./lib/isRBPI");

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

        this.head = {
            left: {
                channel: 4,
                angle: 90,
            },
            right: {
                channel: 5,
                angle: 90,
            }
        }

        // this.channels = [];
        //
        // for (let i = 0; i < 16; i++) {
        //     this.channels.push({
        //         on: false,
        //         angle: 90
        //     });
        // }


        if (isRBPI()) {

            const createPWM = require("./lib/createPWM");
            const i2cBus = require("i2c-bus");

            this.pwm = createPWM({
                i2c: i2cBus.openSync(1),
                address: 0x40,
                frequency: 50,
                debug: true
            });
        }
    }

    /**
     * @param axes {axes: array, x0: number, y0: number, x1: number, y1: number}
     */
    setByGameControllerAxes(data) {
        const {x0, y0} = data;
        console.log({x0, y0});
        const leftAngle = ((x0+1) * 90);
        const rightAngle = ((y0+1) * 90);

        this.head.left.angle = leftAngle;
        this.head.right.angle = rightAngle;

        this.update();
    }

    pulseLengthForAngle(angle) {
        const minPulseLength = 500;   // Pulse length at 0 degrees (µs)
        const maxPulseLength = 2500;  // Pulse length at 180 degrees (µs)
        const minAngle = 0;           // Minimum angle (degrees)
        const maxAngle = 180;         // Maximum angle (degrees)

        // Linear mapping of angle to pulse length
        return ((angle - minAngle) * (maxPulseLength - minPulseLength) / (maxAngle - minAngle)) + minPulseLength;
    }

    async update() {
        console.log('Updating head:', this.head);

        if (this.pwm) {

            const pwd = await this.pwm;
            pwd.setPulseLength(this.head.left.channel, this.pulseLengthForAngle(this.head.left.angle));
            pwd.setPulseLength(this.head.right.channel, this.pulseLengthForAngle(this.head.right.angle));
        }
    }
}

module.exports = Skeletor;