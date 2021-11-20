const resultHandler = (hostname ,result) => {
    index = result.webtimer.hostnames.indexOf(hostname);
    if(index == -1) // doesn't exist
        return {
            exists:false
        };
    return {
        exists:true,
        timeElapsed: result.webtimer.timesElapsed[index]
        // maxTime                                                                      TODO
    };
};

let activeSites;
let currentSite = null;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(!!message.isPopup){
        if(!!activeSites && !!currentSite){ // 
            // check if the popup is adding a timer                                     TODO
            data = resultHandler(currentSite,activeSites);
            if(data.exists)
                sendResponse({
                    hostname:currentSite,
                    timeElapsed:data.timeElapsed
                });
            else {
                // make the ability to add a timer here                                 TODO
                sendResponse({hostname:currentSite});
            }
        }
        else // 
            sendResponse({hostname:'Unavailable'});

    } else if(message.activeTab && message.hostname != undefined){ // Tab is open
        // Access host data
        currentSite = message.hostname;
        chrome.storage.local.get('webtimer', (result) =>{
            activeSites = result.webtimer;
            data = resultHandler(message.hostname, activeSites);
            if(data.exists){
                // Start timer
                sendResponse({ok:true, timeElapsed:data.timeElapsed});
                console.log('OPEN : Time elapsed on : ' + message.hostname + ' : ' + data.timeElapsed);
            }else{ // Timer does not exist
                sendResponse({ok:false});
            }
        });

    }else if(message.hostname != undefined && !message.activeTab){ // Tab is closed
        // Save necessary data
        currentSite = null;
        if(resultHandler(message.hostname,activeSites).exists){
            // Timer is enabled
            activeSites.timesElapsed[activeSites.hostnames.indexOf(message.hostname)] = message.timeElapsed;
            // activeSites.date = message.date
            chrome.storage.local.set({webtimer:{
                hostnames: activeSites.hostnames,
                timesElapsed: activeSites.timesElapsed
                // maxTimes : activeSites.maxTimes,
                // date : activeSites.date
            }}, () => {
                console.log('CLOSE : Saved data on : ' + message.hostname + ' : ' + message.timeElapsed);
            });
        }
        sendResponse({ok:false});
    }else{
        // Timer unavailable on tab
        console.log('Timer unavailable');
        currentSite = null;
        sendResponse({ok:false});
    }
    return true;
});