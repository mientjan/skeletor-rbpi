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
                channel: 5,
                angle: 90,
            },
            right: {
                channel: 4,
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
                debug: false
            });
        }
    }

    /**
     * @param axes {axes: array, x0: number, y0: number, x1: number, y1: number}
     */
    setByGameControllerAxes(data) {
        let {x0, y0} = data;

        const maxAngle = 180;
        const delta = 45;
        const minAngle = 0;

        // x0 = (x0) / 2;
        // y0 = (y0) / 2;

        let leftAngle = 90;
        let rightAngle = 90;

        // leftAngle = 90 + (y0 * 90);
        // rightAngle = 90 + (y0 * 90);

        console.log(`--[${x0}]--[${y0}]--`);

        let a = 0;
        let b = 0;

        // calculates how much to turn the head left or right
        a = -x0 * delta;
        b = x0 * delta;

        leftAngle += a;
        rightAngle += b;

        // console.log({leftAngle, rightAngle, a, b});
        //
        a = (y0 * delta);
        b =  (y0 * delta);

        leftAngle += a;
        rightAngle += b;

        console.log({leftAngle, rightAngle, a, b});

        console.log('Setting head angles:', leftAngle, this.flipValue(rightAngle, maxAngle));

        this.head.left.angle = leftAngle;
        this.head.right.angle = this.flipValue(rightAngle, maxAngle);

        this.head.left.angle = Math.min(Math.max(this.head.left.angle, 45), 135);
        this.head.right.angle = Math.min(Math.max(this.head.right.angle, 45), 135);

        this.update();
    }

    flipValue(value, range){
        return range - value;
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
        // console.log('Updating head:', this.head);

        if (this.pwm) {

            const pwd = await this.pwm;
            pwd.setPulseLength(this.head.left.channel, this.pulseLengthForAngle(this.head.left.angle));
            pwd.setPulseLength(this.head.right.channel, this.pulseLengthForAngle(this.head.right.angle));
        }
    }
}

module.exports = Skeletor;