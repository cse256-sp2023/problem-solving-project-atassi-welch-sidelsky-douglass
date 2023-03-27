/**
 * A progress bar js class that represents a progress bar html element that can fill up to
 * any arbitrary percent of its length and also draw a collection of events on top of the 
 * progress to show actions throughout the period of time the progress bar represents.
 */

RenderEnum = {
    TIME: 0,
    PROGRESS: 1,
    PERCENT: 2,
    properties: {
        0: "TIME",
        1: "PROGRESS",
        2: "PERCENT"
    }
}

class ProgressBar {

    // Simply math value used in drawing circles
    TWO_PI = Math.PI * 2;
    // Color of the bar progression
    BAR_COLOR = 'red';
    // Color of the slider at the end of the progression 
    SLIDER_COLOR = 'black'
        // Color of the click event dots
    CLICK_COLOR = 'green';
    // Color of button down event dots
    BUTTON_DOWN_COLOR = 'blue';
    // Color of special events
    SPECIAL_EVENT_COLOR = 'yellow';
    // Color of back events
    BACK_COLOR = 'purple';
    // The threshold with which to compare the time distance of events to determine if they should be grouped
    GROUP_THRESHOLD_IN_MS = 500;

    /**
     * Constucts a progress bar with the given data.
     * 
     * @param {[]} log - an array of click entries and button down entries.
     * @param {number} startTime - the time that the recording of the mturk interaction started
     * @param {number} totalTime - the total time that the mturk interaction happened.
     */
    constructor(progressBar, log, startTime, totalTime) {
        progressBar.width = progressBar.clientWidth;
        progressBar.height = progressBar.clientHeight;
        this.progressBar = progressBar;
        this.events = this.condenseEvents(log);
        this.startTime = startTime;
        this.totalTime = totalTime;
        /**
         * @type {CanvasRenderingContext2D} this.ctx
         */
        this.ctx = this.progressBar.getContext('2d');
        this.pixelLength = this.progressBar.clientWidth;
        this.height = this.progressBar.clientHeight;
        this.middle = this.height / 2;
        this.render(0, RenderEnum.PERCENT);
    }

    condenseEvents(log) {
        let condensedEvents = [];
        log.forEach((elem) => {
            condensedEvents.push([
                [elem.action, elem.time]
            ]);
        });
        return condensedEvents;
    }

    /**
     * Every item's x coordinate is transformed into a percent of the length of the progress bar
     * which can be transformed into number of pixels using this method.
     * 
     * @param {number} percent - transforms from percent to length in pixels.
     */
    calculateProgress(percent) { return (this.pixelLength * (percent / 100)); }

    /**
     * Calculates the progress of the progress bar that this given time represents.
     * 
     * @param {number} progress - the amount of progress.
     */
    calculatePercentByProgress(progress) { return (100 * (progress / this.pixelLength)); }

    /**
     * Calculates the percent of the progress bar that this given time represents.
     * 
     * @param {number} time - the time that the event happened.
     */
    calculatePercentByTime(time) { return (100 * ((time - this.startTime) / this.totalTime)); }

    /**
     * Calulates the amount of pixels of the progress bar to fill up based on a time.
     * 
     * @param {number} time - the time to calculate progress to.
     */
    calculateProgressByTime(time) { return this.calculateProgress(this.calculatePercentByTime(time)); }

    /**
     * Converts percent of progress bar to number of pixels in progress bar.
     * 
     * @param {number} percent - the percent of the progress bar.
     */
    calculateProgressByPercent(percent) { return this.pixelLength * percent; }

    /**
     * Calculates the time that corresponds to a location on the x axis of the progress bar.
     * Can be used to show how much time a click on the bar is equivalent to.
     * 
     * @param {number} progress - the amount of pixels to the right of the start of the element.
     */
    calculateTimeByProgress(progress) { return (this.startTime + ((progress / this.pixelLength) * this.totalTime)); }

    /**
     * Calculates the radius of the circle based on number of events at once.
     * 
     * @param {number} amount - number of events.
     */
    calculateRadius(amount) { return Math.min(9, amount); }

    /**
     * Clears the progress bar of all drawings.
     */
    clearBar() { this.ctx.clearRect(0, 0, this.pixelLength, this.height); }

    /**
     * This method fills up the progress bar's progress to the specified percent.
     * @param {number} progress - the rightmost pixel to fill to.
     */
    fillUp(progress) {
        this.ctx.fillStyle = this.BAR_COLOR
        this.ctx.fillRect(0, 0, progress, this.height);
    }

    /**
     * Draws a circle with the given data.
     * @param {number} progress - the point of progress (x-coordinate) to draw the event.
     * @param {number} radius - the radius of the circle, based on the number of events it represents.
     */
    drawCircle(progress, radius) {
        this.ctx.beginPath();
        this.ctx.ellipse(
            progress,
            this.middle,
            radius,
            radius,
            0,
            0,
            this.TWO_PI);
        this.ctx.fill();
    }

    /**
     * Draws an event which consists of multiple click and button presses. The longer the length
     * of the event array the bigger the resulting circle is.
     * 
     * @param {[]object} event - an array of objects containing at least a time value.
     */
    drawEvent(event) {
        this.drawCircle(
            this.calculateProgressByTime(event[0][1]),
            this.calculateRadius(3)
        );
    }

    /**
     * Draw all of the events that the progress bar has.
     */
    drawEvents() {
        this.events.forEach(event => {
            switch (event[0][0]) {
                case ActionEnum.CLICK:
                    this.ctx.fillStyle = this.CLICK_COLOR;
                    this.drawEvent(event);
                    break;
                case ActionEnum.BUTTON_DOWN:
                    this.ctx.fillStyle = this.BUTTON_DOWN_COLOR;
                    this.drawEvent(event);
                    break;
                case ActionEnum.SPECIAL_EVENT:
                    this.ctx.fillStyle = this.SPECIAL_EVENT_COLOR;
                    this.drawEvent(event);
                case ActionEnum.BACK:
                    this.ctx.fillStyle = this.BACK_COLOR;
                    this.drawEvent(event);
            }
        });
    }

    /**
     * Draws a slider at the end of the progression bar.
     * 
     * @param {number} progress - the progression value that the progress bar is at.
     */
    drawSlider(progress) {
        this.ctx.fillStyle = this.SLIDER_COLOR
        if (progress === 0) {
            this.ctx.fillRect(progress, 0, 2, this.height);
        } else if (progress === this.pixelLength) {
            this.ctx.fillRect(progress - 2, 0, 2, this.height);
        } else {
            this.ctx.fillRect(progress - 1, 0, 2, this.height);
        }
    }

    /**
     * Renders the entire progress bar with all of its events and filled to the amount specified.
     * 
     * @param {number} value - either a percent or a time that will be used to determine how far
     *                          to fill up the progress bar.
     * 
     * @param {0 | 1 | 2} renderVal - the enum value that represents incoming data.
     */
    render(value, renderVal) {
        switch (renderVal) {
            case RenderEnum.TIME:
                value = this.calculateProgressByTime(value);
                break;
            case RenderEnum.PROGRESS:
                value = value;
                break;
            case RenderEnum.PERCENT:
                value = this.calculateProgressByPercent(value);
                break;
        }
        this.clearBar();
        this.fillUp(value);
        this.drawEvents();
        this.drawSlider(value);
    }

}