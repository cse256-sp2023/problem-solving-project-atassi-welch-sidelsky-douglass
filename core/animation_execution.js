/**
 * Enum of all of the different speeds for playing the animations.
 */

SpeedEnum = {
    REWIND: -1,
    PAUSE: 0,
    PLAY: 1,
    FASTFORWARD: 2,
    properties: {
        0: "REWIND",
        1: "PAUSE",
        2: "PLAY",
        3: "FASTFORWARD"
    }
};

const pausePlayListenFunction = (ex) => {
    ex.exec ? ex.pause() : ex.play();
}

const progressBarListenFunction = (e, ex) => {
    if (ex.pb) {
        if (ex.exec) {
            ex.pause();
        }
        let prog = e.offsetX;
        const time = ex.pb.calculateTimeByProgress(prog);
        ex.currentTime = time;
        let log_i = 0;
        for (; log_i + 1 < ex.log.length && ex.log[log_i].time < time; log_i++);
        ex.i = log_i;
        ex.pb.render(prog, RenderEnum.PROGRESS);
    }
};

/**
 * Class that incurs all of the animation and controls flow of animation.
 */
class Execution {
    // Static offsets for mysterious padding that could not be pinpointed.
    static X_OFFSET() {
        return 0;
    }

    static Y_OFFSET() {
            return 43;
        }
        // Simply math value used in drawing circles
    TWO_PI = Math.PI * 2;
    // Color of event circles
    EVENT_COLOR = "blue";

    constructor(ctx) {
        this.ctx = ctx;
        ctx.fillStyle = this.EVENT_COLOR;
        this.pausePlayButton = document.getElementById("mturk-top-banner-pause-play");
        this.pausePlayButton.removeEventListener("click", pausePlayListenFunction);
        this.progressBar = document.getElementById("mturk-top-banner-progress-bar");
        this.progressBar.removeEventListener("click", progressBarListenFunction);
        this.progressBar.addEventListener("click", (e) => { progressBarListenFunction(e, this); });
        this.change = new EventTarget();
        this.log = null;
        this.pb = null;

        this.timeout = null;
        this.interval = null;

        this.currentTime = 0;
        this.stopTime = 0;

        this.exec = false;
        this.i = 0;
    }

    /**
     * Transforms x and y coordinates to be fit for the canvas element.
     *
     * @param {object} e - object with x and y coordinates.
     */
    getMousePos(e) {
        return {
            x: e.x - Execution.X_OFFSET(),
            y: e.y - Execution.Y_OFFSET()
        };
    }

    /**
     * Clears the graphcis context of the overlay canvas element.
     */
    clearCTX() {
        this.ctx.clearRect(
            0,
            0,
            2 * this.ctx.canvas.width,
            2 * this.ctx.canvas.height
        );
    }

    /**
     * Draws a circle representing a click event on the overlay canvas.
     *
     * @param {object} entry - object with click data.
     */
    drawClickEvent(entry) {
        const fixedLoc = this.getMousePos(entry);
        this.ctx.beginPath();
        this.ctx.fillStyle = DotColor.NEXT();
        this.ctx.arc(fixedLoc.x, fixedLoc.y, 10, 0, this.TWO_PI);
        this.ctx.fill();
        if (entry.elemID != "") {
            try {
                $(`#${entry.elemID}`)[0].click();
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * Adds data to the element where the button was pressed.
     *
     * @param {object} entry - object with button down data.
     */
    drawButtonDownEvent(entry) {
        switch (entry.key) {
            case "Backspace":
                let elem = $(`#${entry.elemID}`)[0];
                let value = elem.value;
                elem.value =
                    value.length == 0 ?
                    value :
                    value.substring(0, value.length - 1);
                break;
            default:
                $(`#${entry.elemID}`)[0].value += entry.key;
        }
    }

    /**
     * Scrolls to a location that shows the action then animates the action on the overlay.
     *
     * @param {object} entry - tracker entry with data to animate on the overlay.
     */
    doAnimate(entry) {
        return new Promise((resolve, reject) => {
            switch (entry.action) {
                case ActionEnum.CLICK:
                    this.drawClickEvent(entry);
                    resolve("click");
                    break;
                case ActionEnum.BUTTON_DOWN:
                    this.drawButtonDownEvent(entry);
                    resolve("press");
                    break;
                case ActionEnum.SCROLL:
                    scrollTo(
                        entry.y,
                        entry.time - this.log[this.i - 1].time,
                        () => {
                            resolve("scroll");
                        }
                    );
                    break;
                case ActionEnum.BACK:
                    standardLoad(entry.data, () => { resolve("back"); });
                    break;
                default:
                    resolve("unusual action");
            }
        });
    }

    /**
     * Performs animation of single entry then sets up the timeout for the next one.
     *
     * @param {number} speed - the speed to set up the next timeout at. Can be negative
     *                          to go backwards, 1 is true speed, 2 is twice true speed etc.
     */
    doAnimateAndUpdateTimeout(speed) {
        const sign = Math.sign(speed);
        if (sign === SpeedEnum.PAUSE) {
            return;
        }
        this.buildProgressBarInterval(speed);
        this.doAnimate(this.log[this.i]).then(result => {
            console.log(result);
            const mag = speed * sign;
            let time = 0;
            if (this.i < this.log.length - 1) {
                time = this.log[this.i + 1].time - this.log[this.i].time;
            } else {
                this.pause();
                this.dispatchChange("state", { change: "finish" });
                return;
            }
            this.i += sign;
            this.currentTime = this.log[this.i].time;
            this.timeout = setTimeout(() => {
                clearInterval(this.interval);
                this.pb.render(this.currentTime, RenderEnum.TIME);
                this.doAnimateAndUpdateTimeout(this.speed);
            }, time / mag);
        });
    }

    /**
     * Builds the interval that backs the progress bar.
     *
     * @param {number} speed - the speed to set up the next timeout at. Can be negative
     *                          to go backwards, 1 is true speed, 2 is twice true speed etc.
     */
    buildProgressBarInterval(speed) {
        if (speed === SpeedEnum.PAUSE) {
            return;
        }
        const intervalProgression = 10;
        const speedProgression = speed * intervalProgression;
        let pbCurrentTime = this.currentTime;
        this.interval = setInterval(() => {
            this.pb.render(pbCurrentTime, RenderEnum.TIME);
            pbCurrentTime =
                speed < 0 ?
                pbCurrentTime + speedProgression <= this.startTime ?
                this.startTime :
                pbCurrentTime + speedProgression :
                pbCurrentTime + speedProgression >= this.stopTime ?
                this.stopTime :
                pbCurrentTime + speedProgression;
            if (speed > 0 && pbCurrentTime >= this.stopTime) {
                clearInterval(this.interval);
                //console.log("forward clear");
            } else if (speed < 0 && pbCurrentTime <= this.startTime) {
                clearInterval(this.interval);
                //console.log("backward clear");
            }
        }, intervalProgression);
    }

    /**
     * Clears all timers and begins progression of progress bar and action animations.
     *
     * @param {number} speed - the speed to set up the next timeout at. Can be negative
     *                          to go backwards, 1 is true speed, 2 is twice true speed etc.
     */
    doProgression(speed) {
        this.clearTimers();
        this.exec = true;
        this.doAnimateAndUpdateTimeout(speed);
        //this.buildProgressBarInterval(speed);
    }

    /**
     * Returns a do progression function with the given speed.
     *
     * @param {number} speed - the speed to set up the next timeout at. Can be negative
     *                          to go backwards, 1 is true speed, 2 is twice true speed etc.
     */
    doProgressionWrapper(speed) {
        return () => {
            this.doProgression(speed);
        };
    }

    /**
     * Clears the progression interval and animation timeout.
     */
    clearTimers() {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    /**
     * Resets everything to 0.
     */
    reset() {
        this.exec = false;
        this.clearTimers();
        this.i = 0;
        this.currentTime = this.startTime;
        this.pb.render(0);
        this.clearCTX();
        this.dispatchChange("state", { change: "reset" });
    }

    /**
     * Pauses the progression without resetting data.
     */
    pause() {
        if (this.exec) {
            this.speed = SpeedEnum.PAUSE;
            this.clearTimers();
            // if (this.i !== 0 && this.i !== this.log.length - 1) {
            //     this.i -= 1;
            // }
            this.currentTime = this.log[this.i].time;
            this.pb.render(this.currentTime, RenderEnum.TIME);
            this.exec = false;
            this.dispatchChange("state", { change: "pause" });
        }
    }

    play() {
        this.speed = SpeedEnum.PLAY;
        this.doProgression(SpeedEnum.PLAY);
        this.dispatchChange("state", { change: "play" });
    }

    /**
     * This method runs when new user data is uploaded. It builds a new progress bar with
     * the data and updates some internal variables as well.
     *
     * @param {UserData} data - the new UserData that has been verified and uploaded.
     */
    intakeUserData(data) {
        this.log = data.log;
        this.startTime = data.timeRangeInMilliseconds.start;
        this.currentTime = data.timeRangeInMilliseconds.start;
        this.stopTime = data.timeRangeInMilliseconds.stop;
        this.log.push(
            new SpecialEventEntry(ActionEnum.SPECIAL_EVENT, this.stopTime, {
                purpose: "Final event."
            })
        );
        this.log = this.smoothLog(this.log);
        this.pb = new ProgressBar(
            this.progressBar,
            this.log,
            this.startTime,
            data.timeRangeInMilliseconds.elapsed
        );
        this.pausePlayButton.addEventListener("click", () => { pausePlayListenFunction(this) });
        this.dispatchChange("state", { change: "intake" });
    }

    /**
     * This function smooths out the scroll events and groups ones that seem related by direction and amount of time between individual scrolls.
     *
     * @param {ClickEntry | ButtonDownEntry | SpecialEventEntry | ScrollEntry[]} log - the log of entries including scroll entries.
     */
    smoothLog(log) {
        let smt = [];
        log.forEach(element => {
            if (element.action === ActionEnum.SCROLL) {
                let elem = smt[smt.length - 1];
                if (
                    elem.action === ActionEnum.SCROLL &&
                    elem.time - element.time >= -100
                ) {
                    let direction = elem.y - element.y <= 0 ? "DOWN" : "UP";
                    if (elem.direction === null) {
                        elem.direction = direction;
                    }
                    if (elem.direction === direction) {
                        elem.time = element.time;
                        elem.y = element.y;
                        elem.x = element.x;
                    } else {
                        element.direction = direction;
                        smt.push(element);
                    }
                } else {
                    element.direction = null;
                    smt.push(element);
                }
            } else {
                smt.push(element);
            }
        });
        return smt;
    }

    dispatchChange(type, data) {
        this.change.dispatchEvent(new CustomEvent(type, { detail: data }));
    }

    addChangeListener(type, func) {
        this.change.addEventListener(type, func);
    }
}

class DotColor {
    static COLORS = [
        "black",
        "red",
        "orange",
        "green",
        "blue",
        "pink",
        "purple"
    ];
    static INDEX = 0;

    static NEXT() {
        const color = this.COLORS[this.INDEX];
        this.INDEX = this.INDEX < this.COLORS.length - 1 ? this.INDEX + 1 : 0;
        return color;
    }
}