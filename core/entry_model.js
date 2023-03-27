/**
 * Enum for all actions that are recored using the tracker js.
 */
ActionEnum = {
    NA: 0,
    CLICK: 1,
    BUTTON_DOWN: 2,
    SPECIAL_EVENT: 3,
    SCROLL: 4,
    BACK: 5,
    properties: {
        0: "NA",
        1: "CLICK",
        2: "BUTTON_DOWN",
        3: "SPECIAL_EVENT",
        4: "SCROLL",
        5: "BACK"
    }
}

/**
 * Class representing click action done during tracker js.
 */
class ClickEntry {
    constructor(action, x, y, elemID, time) {
        this.action = action;
        this.x = x;
        this.y = y;
        this.elemID = elemID;
        this.time = time;
    }
}

/**
 * Class representing button down entry action done during tracker js.
 */
class ButtonDownEntry {
    constructor(action, x, y, elemID, key, time) {
        this.action = action;
        this.x = x;
        this.y = y;
        this.elemID = elemID;
        this.time = time;
        this.key = key;
    }
}

/**
 * Class representing any special action done that is recored by tracker js and is
 * not a usual button down or click entry.
 */
class SpecialEventEntry {
    constructor(action, time, data) {
        this.action = action;
        this.time = time;
        this.data = data;
    }
}

/**
 * Class representing a scroll event that was tracked.
 */
class ScrollEntry {
    constructor(action, time, x, y) {
        this.action = action;
        this.time = time;
        this.x = x;
        this.y = y;
    }
}