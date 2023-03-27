AppEnum = {
    NURSERY_SCHOOL: 'nursery-school',
    SET: 'set',
    GENDER_MAG: 'gender-mag'
}

/**
 * All /$(.*)/ elements are jquery DOM elements.
 * 
 * @type {UserData} userData - user data created using tracker js.
 * @type {Execution} execution - the function to control animation of all of the events.
 * @type {PageHistory} pageHistory - a page hiatory to make us of the back button.
 */
let $wrapper = $("#wrapper"),
    $htmlLoc = $("#html-loc"),
    $innerBody = $("#inner-body"),
    $ddDown = $("#mturk-top-banner-drop-down-button"),
    $ddUp = $("#mturk-top-banner-collapse-button"),
    $ddContent = $("#mturk-top-banner-drop-down-content"),
    $backButton = $("#mturk-top-banner-back"),
    topCtx = null,
    userData = null,
    execution = null,
    pageHistory = new PageHistory('/nursery-school/initial-files/index.html', $backButton);
canvasSizeListener = new EventTarget(),
    app = '';

/**
 * Sets up the canvas that overlays the whole page. 
 * Can only be set up when the user data has been loaded.
 */
function setUpCanvas() {
    let canvas = document.createElement("canvas");
    canvas.setAttribute('id', 'canvas');
    canvasSizeListener.addEventListener('resize', (e) => {
        canvas.setAttribute('height', e.detail.height);
        canvas.setAttribute('width', e.detail.width);
    });
    $wrapper.append(canvas);
    topCtx = canvas.getContext('2d');
}

/**
 * Scrolls the top of the screen to the y value specified.
 * 
 * @param {number} y - the top pixel of the screen.
 */
function scrollTo(y, time = 0, complete = () => { console.log("default") }) {
    $innerBody.animate({ scrollTop: y }, time, 'swing', complete);
}

/**
 * Loads the image found at imageURL into the main element in the page.
 * 
 * @param {string} imageURL - url string of the image for the single image page.
 */
function singleImagePageLoad(imageURL) { $("#single-image").attr({ 'src': imageURL }); }

/**
 * Attaches ids to all html elements in the DOM that do not have ids.
 */
function attachIdsToAllElements() {
    $("#html-loc *").each(function(index, elem) {
        if (!elem.id) {
            elem.id = ("id-" + index);
        }
    });
}

/**
 * Attaches listeners to all links in the DOM.
 */
function attachLinkListeners() {
    $("#html-loc a").on("click", function(e) {
        if (!e.target.href || e.target.href === '' || e.target.href.includes('#')) {
            return;
        }
        e.preventDefault();
        const nextURL = pageHistory.forwardHistory(e.target.href);
        if (execution && execution.exec) {
            execution.pause();
            setTimeout(() => { standardLoad(nextURL, () => { execution.play() }); }, 1000);
        } else {
            standardLoad(nextURL);
        }
    });
}

/**
 * Attaches listeners to all images in the DOM.
 */
function attachImageListeners() {
    $("#html-loc img").on("click", function(e) {
        e.preventDefault();
        const pageURL = '/nursery-school/initial-files/single_image.html',
            imageURL = e.target.src;
        pageHistory.forwardHistory(pageURL, imageURL);
        if (execution && execution.exec) {
            execution.pause();
            setTimeout(function() {
                standardLoad(pageURL, () => {
                    singleImagePageLoad(imageURL)
                    execution.play();
                });
            }, 500);
        } else {
            setTimeout(() => { standardLoad(pageURL, () => { singleImagePageLoad(imageURL) }); }, 1000);
        }
    });
}

/*
Attaching listeners to all forms that are not the main submission form so that they do not submit, thus causing an error.
*/
function attachFormListeners() {
    $("#html-loc form").on("submit", function(e) {
        e.preventDefault();
        alert('All forms except for the one in the top header are inactive.');
    });
}

/**
 * Call this function to reset up the page after a new page has been loaded in.
 */
function setUpAfterLoad() {
    if (execution) {
        execution.clearCTX();
    }
    attachIdsToAllElements();
    attachLinkListeners();
    attachImageListeners();
    attachFormListeners();
    scrollTo(0);
}

/**
 * Sets up the banner when the page loads in the beginning.
 */
function setUpBanner() {
    $ddUp.show();
    $ddDown.hide();
    $ddContent.show();

    $("#mturk-top-banner-arrow").on("click", () => {
        if ($ddContent.is(":visible")) {
            $ddContent.hide();
            $ddUp.hide();
            $ddDown.show();
        } else {
            $ddContent.show();
            $ddUp.show();
            $ddDown.hide();
        }
    });

    $backButton.on("click", (e) => {
        e.stopPropagation();
        const response = pageHistory.backHistory();
        if (response.success) {
            standardLoad(response.url);
        }
    });

    $('#mturk-top-banner-clear').on("click", (e) => {
        if (execution) {
            execution.clearCTX();
        }
    })

    function hasAllProperties(obj, properties) {
        let hasAll = true;
        properties.forEach(s => {
            if (!obj.hasOwnProperty(s)) {
                hasAll = false;
            }
        });
        return hasAll;
    }

    function setUpAfterUserDataLoad() {
        let ibw = $innerBody[0].scrollWidth,
            ibh = $innerBody[0].scrollHeight,
            nibw = 0,
            nibh = 0,
            ce = new CustomEvent('resize', { detail: { width: nibw, height: nibh } });
        setInterval(() => {
            nibw = $innerBody[0].scrollWidth, nibh = $innerBody[0].scrollHeight - Execution.Y_OFFSET();
            if (nibw != ibw || nibh != ibh) {
                ibw = nibw, ibh = nibh, ce.detail.width = nibw, ce.detail.height = nibh;
                canvasSizeListener.dispatchEvent(ce);
            }
        }, 50);
        $innerBody.css({
            'width': userData.windowSize.width,
            'height': userData.windowSize.height,
            'position': 'absolute',
            'overflow-x': 'scroll',
            'overflow-y': 'visible',
        });
        if (app === AppEnum.NURSERY_SCHOOL) {
            $('#scenario_context').text(userData.taskData.scenario);
            $('#scenario_question').text(userData.taskData.task);
            $('#scenario_input_response').text("Response: " + userData.taskData.response);
        }
    }

    $('#mturk-top-banner-drop-down-content-log-file-input').change(function(e) {
        standardLoad("/nursery-school/index.html", () => {
            scrollTo(0, 0, () => {
                let files = e.target.files;
                if (files) {
                    let file = files[0];
                    if (file.type != "application/json") {
                        alert("The wrong type of file has been entered. It must be a .json.");
                        return;
                    }
                    let fileReader = new FileReader();
                    fileReader.onload = function(fileLoadedEvent) {
                        let textFromFileLoaded = fileLoadedEvent.target.result;
                        userData = JSON.parse(textFromFileLoaded);
                        if (hasAllProperties(userData, UserData.PROPERTIES)) {
                            if (userData.log.length > 0) {
                                if (execution) {
                                    execution.reset();
                                }
                                execution = new Execution(topCtx);
                                setupExecutionChangeListeners();
                                setUpAfterUserDataLoad();
                                alert("Your log file appears to be valid, it has been loaded and parsed.");
                                execution.intakeUserData(userData);
                            } else {
                                userData = null;
                                alert("An empty log has been supplied.");
                            }
                        } else {
                            userData = null;
                            alert("An invalid log file has been supplied.");
                        }
                    };
                    fileReader.readAsText(file, "UTF-8");
                }
            });
        });
    });
}

/**
 * Performs a standard load operation with the specified html content.
 * 
 * @param {string} location - the new url to grab html content from.
 * @param {function} extraWork - a function to perform after loading the html content into the page.
 */
function standardLoad(location, extraWork) {
    $htmlLoc.load(location, null, function() {
        setUpAfterLoad();
        if (typeof extraWork === 'function') {
            extraWork();
        }
    });
}

function setupExecutionChangeListeners() {
    // ********* This is a section dependent on app. ************//
    if (app === AppEnum.SET) {
        execution.addChangeListener('state', controller.listenForStateChange());
    }
}

/**
 * Performs the intial set up after the DOM has loaded.
 */
$(document).ready(() => {
    // ********* This is a section dependent on app. ************//
    nsready = () => {
        standardLoad($htmlLoc.data("page"), () => {
            setUpCanvas();
            setUpBanner();
        });
    }

    setready = () => {
        setUpCanvas();
        setUpBanner();
    }

    gmready = () => {

    }

    app = $htmlLoc.data('app');

    if (app === AppEnum.NURSERY_SCHOOL) {
        nsready();
    } else if (app === AppEnum.SET) {
        setready();
    } else if (app === AppEnum.GENDER_MAG) {
        gmready();
    }
});

/**
 * Temporary user data so that I do not have to keep loading in data manually.
 */