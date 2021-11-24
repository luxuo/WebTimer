const resultHandler = (hostname, result) => {
    index = result.hostnames.indexOf(hostname);
    if (index == -1) // doesn't exist
        return {
            exists: false
        };
    return {
        exists: true,
        timeElapsed: result.timesElapsed[index],
        maxTime: result.maxTimes[index],
        date: result.date
    };
};

const dateChange = (past, current) => {
    current = new Date(current);
    past = new Date(past);
    return current.getDate() > past.getDate() || current.getFullYear() > past.getFullYear() || current.getMonth() > past.getMonth();
}

const handleDailyTimer = (activeSites, pastDate, currentDate) => {
    if (dateChange(pastDate, currentDate)) {
        activeSites.timesElapsed.fill(0);
        activeSites.date = currentDate;
    }
}

const resultRepairman = (result) => { // help
    if (!result)
        return result = {
            hostnames: ['0'],
            timesElapsed: [0],
            maxTimes: [0],
            date: new Date()
        }
    return result;
}

let activeSites;
let currentSite = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!!message.isPopup) {
        if (!!activeSites && !!currentSite) { // 
            if (message.isAddingTimer) {
                activeSites.hostnames.push(message.hostname);
                activeSites.timesElapsed.push(0);
                activeSites.maxTimes.push(message.maxTime);
                sendResponse({ hostname: currentSite, timeElapsed: 0, timerExists: true });
            } else {
                data = resultHandler(currentSite, activeSites);
                if (data.exists)
                    sendResponse({
                        hostname: currentSite,
                        timeElapsed: data.timeElapsed,
                        timerExists: true,
                        maxTime: data.maxTime
                        //date : data.date                                                  TODO
                    });
                else {
                    sendResponse({ hostname: currentSite, timerExists: false });
                }
            }

        }
        else // Invalid site
            sendResponse({ hostname: 'Unavailable', current: currentSite, active: activeSites });

    } else if (message.activeTab && message.hostname != undefined) { // Tab is open
        // Access host data
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

    } else if (message.hostname != undefined && !message.activeTab) { // Tab is closed
        // Save necessary data
        currentSite = null;
        console.log('TAB GETS CLOSED');/////////////////////////////////////////////////////////////////////////
        if (resultHandler(message.hostname, activeSites).exists) {
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
                // Log if you need
            });
        }
        sendResponse({ ok: false });
    } else {
        // Timer unavailable on tab
        console.log('TIMER UNAVAILABLE');//////////////////////////////////////////////////////////////////////////////////
        currentSite = null;
        sendResponse({ ok: false });
    }
    return true;
});