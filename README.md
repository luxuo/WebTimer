"# WebTimer" 

HOW IT WORKS : 

All websites with a valid hostname (not any chrome default/settings pages) are injected with content.js

--------------------------------------------------------------------
        content.js
ON VISIBILITY CHANGE :
    send PAGECALL
    recieve PAGECALLBACK
    if PAGECALLBACK.ok
        start TIMER
        if timeElapsed > maxTime                                TODO
            deactivate website                                  TODO
    else
        stop TIMER
--------------------------------------------------------------------
        background.js
ON MESSAGE :
    if POPCALL
        if message.isAdding
            add new timer to website
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

--------------------------------------------------------------------
Object in content -> background messaging       PAGECALL
{
    activeTab : (bool),
    hostname : (string),
    timeElapsed : (int),
    date : (Date)
}
Object in content <- background callback        PAGECALLBACK
{
    ok : (bool),
    timeElapsed : (int),
    maxTime : (int)
}

Object in popup -> background messaging         POPCALL
{
    isPopup : (bool),
    isAddingTimer : (bool),
    hostname : (string),
    maxTime : (int)
}

Object in popup <- background callback          POPCALLBACK
{
    hostname : (string),
    timerExists : (bool),
    timeElapsed : (int)
}

Object stored in chrome.storage.local
webtimer : {
    hostnames : (string) -> [],
    timesElapsed : (int) -> [],
    maxTimes : (int) -> [],
    date : (Date)
}