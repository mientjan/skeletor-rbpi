
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

        this.onStep = 42;
        this.offStep = 255;
        this.channel = 4;
        this.pulseLength = 1500;
        this.angle = 0;



        if (isRBPI()) {

            const createPWM = require("./lib/createPWM");
            const i2cBus = require("i2c-bus");

            this.pwm = createPWM({
                i2c: i2cBus.openSync(1),
                address: 0x40,
                frequency: 100,
                debug: true
            });
        }
    }

    setOnStep(step) {
        this.onStep = parseFloat(step);
    }

    setOffStep(step) {
        this.offStep = parseFloat(step);
    }

    setChannel(channel) {
        if(!channel){
            return;
        }
        this.channel = parseInt(channel, 10);
    }

    setPulseLength(length) {
        if(!length){
            return;
        }
        this.pulseLength = parseInt(length, 10);
    }

    setAngle(angle) {
        if(!angle){
            return;
        }
        this.angle = parseInt(angle, 10);
    }

    async test() {

        if (isRBPI()) {
            const pwm = await this.pwm;

            pwm.channelOn(this.channel);


            // pwm.setPulseLength(this.channel, this.pulseLengthForAngle(this.angle));
            pwm.setPulseLength(this.channel, 1000);

            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    pwm.setPulseLength(this.channel, 1500);
                    resolve();
                }, 3000);
            });

            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    pwm.setPulseLength(this.channel, 2000);
                    resolve();
                }, 1000);
            });

            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    pwm.setPulseLength(this.channel, 1500);
                    resolve();
                }, 1000);
            });






            // await new Promise((resolve, reject) => {
            //     pwm.setPulseRange(this.channel, this.onStep, this.offStep, resolve);
            // });
        } else {
            console.log(this.channel, this.pulseLength, this.onStep, this.offStep);
        }
    }

    // updateStep() {
    //
    //     if (isRBPI()) {
    //         const pwm = await this.pwm;
    //
    //         pwm.channelOn(this.channel);
    //
    //         // pwm.setPulseLength(this.channel, this.pulseLengthForAngle(this.angle));
    //         pwm.setPulseRange(this.channel, this.onStep, this.offStep);
    //
    //         // await new Promise((resolve, reject) => {
    //         //     pwm.setPulseRange(this.channel, this.onStep, this.offStep, resolve);
    //         // });
    //     } else {
    //         console.log(this.channel, this.pulseLength, this.onStep, this.offStep);
    //     }
    // }

    pulseLengthForAngle(angle) {
        const minPulseLength = 500;   // Pulse length at 0 degrees (µs)
        const maxPulseLength = 2500;  // Pulse length at 180 degrees (µs)
        const minAngle = 0;           // Minimum angle (degrees)
        const maxAngle = 180;         // Maximum angle (degrees)

        // Linear mapping of angle to pulse length
        return ((angle - minAngle) * (maxPulseLength - minPulseLength) / (maxAngle - minAngle)) + minPulseLength;
    }
}

module.exports = Skeletor;