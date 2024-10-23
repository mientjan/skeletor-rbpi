class GameControllers {
    constructor(props = {debug: true}) {
        this.shouldDebug = props.debug || false;
        this.gamepads = [];
        this._events = {};
        this._cache = {};

        window.addEventListener("gamepadconnected", (e) => {
            this.debug(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length,
            );

            this.debug(e.gamepad);

            this.registerGamepad(e.gamepad);
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            this.debug("Gamepad disconnected from index %d: %s",
                e.gamepad.index, e.gamepad.id);

            this.unregisterGamepad(e.gamepad);
        });

        setInterval(this.loop.bind(this), 1000 / 10);

    }

    _cacheGamepad(gamepad) {
        this._cache[gamepad.index] = gamepad;
    }

    registerGamepad(gamepad) {
        this.gamepads.push(gamepad);
        this._cacheGamepad(gamepad);
    }

    unregisterGamepad(gamepad) {
        this.gamepads = this.gamepads.filter((gp) => gp.id !== gamepad.id);
    }

    debug(){
        if(this.shouldDebug){
            console.log.apply(console, arguments);
        }
    }

    loop(){

        this.gamepads.forEach((gamepad) => {
            const pad = navigator.getGamepads()[gamepad.index];
            const cachedPad = this._cache[gamepad.index];
            const padAxesSum = pad.axes.reduce((acc, val) => acc + val, 0);
            const cachedPadAxesSum = cachedPad.axes.reduce((acc, val) => acc + val, 0);

            if(padAxesSum !== cachedPadAxesSum){
                this.triggerEventListener(`gamepad${gamepad.index}:axes`, {
                    axes: pad.axes,
                    x0: pad.axes[0],
                    y0: pad.axes[1],
                    x1: pad.axes[2],
                    y1: pad.axes[3],
                });
                this._cacheGamepad(pad);
            }
        });

        // window.requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * @example
     *  update:gamepad${gamepad.index}:axes, [0,1,0,.5]
     *
     *
     * @param {string} eventName
     * @param {function} fn
     */
    addEventListeners(eventName, fn) {
        if(!this._events[eventName]){
            this._events[eventName] = [];
        }
        this._events[eventName].push(fn);
    }

    triggerEventListener(eventName, data) {

        if (this._events[eventName]){
            this._events[eventName].forEach((fn) => {
               fn.call(this, data)
            });
        }
        // this.gamepads.forEach((gamepad) => {
        //     const c = navigator.getGamepads()[gamepad.index];
        //     this.debug(c);
        // });
    }

}