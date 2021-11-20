let interval;
let timeElapsed = -1;

const messenger = () => {
    chrome.runtime.sendMessage({
        activeTab: document.visibilityState == 'visible',
        hostname: location.hostname,
        timeElapsed: timeElapsed
    }, (response) => {
        if (response.ok) {
            console.log('Opened tab, time elapsed is : ' + response.timeElapsed);
            timeElapsed += response.timeElapsed;
            interval = setInterval(() => {
                timeElapsed++;
                console.log('TICK : ' + timeElapsed);
            }, 1000);
        } else {
            console.log('Closed tab, time elapsed is :' + timeElapsed);
            clearInterval(interval);
            timeElapsed = -1;
        }
    })
};
messenger();
document.addEventListener('visibilitychange', messenger)