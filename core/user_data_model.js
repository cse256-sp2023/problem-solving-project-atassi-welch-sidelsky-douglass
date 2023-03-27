class UserData {

    constructor(log, scenario, task, tag, app, search, domWidth, domHeight, startTime, completeHistory) {
        this.log = log;
        this.taskData = {
            scenario: scenario,
            task: task,
            tag: tag,
            app: app,
            response: ''
        };
        this.search = search;
        this.windowSize = {
            width: domWidth,
            height: domHeight,
        };
        this.timeRangeInMilliseconds = {
            start: startTime,
            stop: startTime,
            elapsed: 0,
        };
        this.completeHistory = completeHistory;
        if (startTime > 0) {
            let ud = this;
            this.interval = setInterval(function() {
                ud.timeRangeInMilliseconds.elapsed += 100;
                ud.timeRangeInMilliseconds.stop += 100;
            }, 100);
        }
        this.infoPages = [];
    }
}

UserData.PROPERTIES = ['log', 'taskData', 'search', 'windowSize', 'timeRangeInMilliseconds', 'completeHistory'];