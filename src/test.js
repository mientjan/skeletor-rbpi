var i2cBus = require("i2c-bus");
var createPWM = require("./lib/createPWM");

async function test(){
    var options = {
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false
    };

    try {
        var pwm = await createPWM(options);
    } catch (err) {
        console.error("Error initializing PWM:", err);
        process.exit(-1);
    }
    // Set channel 0 to turn on on step 42 and off on step 255
    // (with optional callback)

    // Turn on channel 3 (100% power)
    pwm.channelOn(4);
    pwm.channelOn(5);
    pwm.setPulseRange(4, 42, 255, function(err) {
        if (err) {
            console.error("Error setting pulse range.");
        } else {
            console.log("Pulse range set.");
        }
    });

    // Set the pulse length to 1500 microseconds for channel 2
    pwm.setPulseLength(4, 1500);

    // Set the duty cycle to 25% for channel 8
    pwm.setDutyCycle(5, 0.25);

    // Turn off all power to channel 6
    // (with optional callback)
    pwm.channelOff(6, function(err) {
        if (err) {
            console.error("Error turning off channel.");
        } else {
            console.log("Channel 6 is off.");
        }
    });

    // Turn on channel 3 (100% power)
    pwm.channelOn(3);
}

test();