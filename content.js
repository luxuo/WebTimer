let interval;
let timeElapsed = 0;

const messenger = () => {
    currentDate = new Date();
    chrome.runtime.sendMessage({
        activeTab: document.visibilityState == 'visible',
        hostname: location.hostname,
        timeElapsed: timeElapsed,
        date:currentDate
    }, (response) => {
        if (response.ok) {
            timeElapsed += response.timeElapsed;
            interval = setInterval(() => {
                // check if time has exceeded TODO
                // check if time needs to be reset
                timeElapsed++;
                console.log('TICK : ' + timeElapsed);
            }, 1000);
        } else {
            clearInterval(interval);
            timeElapsed = 0;
        }
    })
};
messenger();
document.addEventListener('visibilitychange', messenger)