// resultHandler(str, {})
// returns -> {}
// Returns data about the web timer if 
//  the hostname has a timer
const resultHandler = (hostname, result) => {
    index = result.hostnames.indexOf(hostname);
    if (index == -1) // timer doesn't exist
        return {
            exists: false
        };
    return { // timer exists
        exists: true,
        timeElapsed: result.timesElapsed[index],
        maxTime: result.maxTimes[index],
        date: result.date
    };
};

// dateChange(Date, Date)
// returns -> bool
// Returns whether there is a change of day
const dateChange = (past, current) => {
    current = new Date(current);
    past = new Date(past);
    return current.getDate() > past.getDate() || current.getFullYear() > past.getFullYear() || current.getMonth() > past.getMonth();
}

// handleDailyTimer( {}, Date, Date)
// Resets the timeElapsed if a date has changed since
//  last access of the sites with timers on
const handleDailyTimer = (activeSites, pastDate, currentDate) => {
    if (dateChange(pastDate, currentDate)) { // date has changed
        // Reset time elapsed
        activeSites.timesElapsed.fill(0);
        activeSites.date = currentDate;
    }
}

// resultRepairman({})
// returns -> {}
// Returns a new compatible object if
//  result does not exist
const resultRepairman = (result) => {
    if (!result) // Empty object
        return result = {
            hostnames: ['0'],
            timesElapsed: [0],
            maxTimes: [0],
            date: new Date()
        }
    return result; // result is ok
}

let activeSites; // object containing all website timer data
let currentSite = null; // str hostname of the current website

// Listen for all messages from content.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!!message.isPopup) { 
        // DATA SENDING FROM popup.js
        if (!!activeSites && !!currentSite) { // Website is valid
            if (message.isAddingTimer) {
                // ADDING TIMER
                activeSites.hostnames.push(message.hostname);
                activeSites.timesElapsed.push(0);
                activeSites.maxTimes.push(message.maxTime);
                sendResponse({ hostname: currentSite, timeElapsed: 0, timerExists: true });
            } else {
                // FETCH DATA 
                data = resultHandler(currentSite, activeSites);
                if (data.exists) // Website has timer
                    sendResponse({
                        hostname: currentSite,
                        timeElapsed: data.timeElapsed,
                        timerExists: true,
                        maxTime: data.maxTime
                        //date : data.date                                                  TODO
                    });
                else { // Website does not have a timer
                    sendResponse({ hostname: currentSite, timerExists: false });
                }
            }

        }
        else // Invalid site
            sendResponse({ hostname: 'Unavailable', current: currentSite, active: activeSites });

    } else if (message.activeTab && message.hostname != undefined) {
        // TAB IS OPEN : Access host data
        currentSite = message.hostname;
        chrome.storage.local.get('webtimer', (result) => {
            // Make sure the result is complete                                         TODO REFACTOR
            activeSites = resultRepairman(result.webtimer);
            handleDailyTimer(activeSites, activeSites.date, message.date);
            data = resultHandler(message.hostname, activeSites);
            if (data.exists) {
                // Start timer
                sendResponse({ ok: true, timeElapsed: data.timeElapsed, maxTime: data.maxTime });
            } else { // Timer does not exist
                sendResponse({ ok: false });
            }
        });

    } else if (message.hostname != undefined && !message.activeTab) {
        // TAB CLOSURE : Save necessary data
        currentSite = null;
        console.log('TAB GETS CLOSED');/////////////////////////////////////////////////////////////////////////
        if (resultHandler(message.hostname, activeSites).exists) { // Counter is activated for the website
            // Timer is enabled
            activeSites.timesElapsed[activeSites.hostnames.indexOf(message.hostname)] = message.timeElapsed;
            activeSites.date = message.date
            chrome.storage.local.set({
                webtimer: {
                    hostnames: activeSites.hostnames,
                    timesElapsed: activeSites.timesElapsed,
                    maxTimes: activeSites.maxTimes,
                    date: activeSites.date
                }
            }, () => {
                // Log if you need chrome.storage callback
            });
        }
        sendResponse({ ok: false });
    } else {
        // TIMER UNAVAILABLE ON CURRENT TAB
        console.log('TIMER UNAVAILABLE');//////////////////////////////////////////////////////////////////////////////////
        currentSite = null;
        sendResponse({ ok: false });
    }
    return true;
});