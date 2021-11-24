# WebTimer

## content.js
```
ON VISIBILITY CHANGE:
    send PAGECALL
    recieve PAGECALLBACK
    if PAGECALLBACK.ok
        start TIMER
        if timeElapsed > maxTime                                TODO
            deactivate website                                  TODO
    else
        stop TIMER
```
## background.js
```
ON MESSAGE :
    if POPCALL
        if message.isAdding
            add new timer to website
            send POPCALLBACK
        else 
            check if activeSites != null
                send POPCALLBACK
    else if PAGECALL.active && valid website
        get stored information
            set activeSites
            process data 
                send PAGECALLBACK
    else if !PAGECALL.active && valid website
        set activeSites
        save activeSites
        set activeSites -> null
        send PAGECALLBACK
    else
        set activeSites -> null
        send PAGECALLBACK
```
---
### PageCall
Object in content -> background messaging
```
{
    activeTab : (bool),
    hostname : (string),
    timeElapsed : (int),
    date : (Date)
}
```
### PageCallBack
Object in content <- background callback
```
{
    ok : (bool),
    timeElapsed : (int),
    maxTime : (int)
}
```
### PopCall
Object in popup -> background messaging
```
{
    isPopup : (bool),
    isAddingTimer : (bool),
    hostname : (string),
    maxTime : (int)
}
```
### PopCallBack
Object in popup <- background callback
```
{
    hostname : (string),
    timerExists : (bool),
    timeElapsed : (int),
    maxTime : (int),
    date : (Date)
}
```
### Storage
Object stored in chrome.storage.local
```
webtimer : {
    hostnames : (string) -> [],
    timesElapsed : (int) -> [],
    maxTimes : (int) -> [],
    date : (Date)
}
```