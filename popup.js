let domain = document.getElementById("domain");

let timerparent = document.getElementById("timerparent");
let hour = document.getElementById("hour");
let minute = document.getElementById("minute");

let submitParent = document.getElementById("submitparent");
let timeInHours = document.getElementById("hourTimer");
let timeInMinutes = document.getElementById("minuteTimer");
let button = document.getElementById("submit");

let hostname;
chrome.runtime.sendMessage({isPopup:true}, (response) => {
    hostname = response.hostname;
    domain.innerHTML = hostname;
    console.log(response.hostname);
    if(response.timerExists){
        timerparent.style.display = "block";
        submitParent.style.display = "none";
        minute.innerHTML = (response.maxTime - response.timeElapsed) % 60;
        hour.innerHTML = parseInt((response.maxTime - response.timeElapsed) / 60);
    } else if(response.hostname == 'Unavailable'){
        timerparent.style.display = "none";
        submitParent.style.display = "none";
    }else{
        timerparent.style.display = "none";
        submitParent.style.display = "block";
    }
});

button.addEventListener('click', () =>{
    return;
    chrome.runtime.sendMessage({
        isPopup : true,
        isAddingTimer: true,
        hostname: hostname,
        maxTime : parseInt(timeInHours.value) * 3600 + parseInt(timeInMinutes.value) * 60
    }, (response) => {
        minute.innerHTML = (response.maxTime - response.timeElapsed) % 60;
        hour.innerHTML = parseInt((response.maxTime - response.timeElapsed) / 60);
        timerparent.style.display = "block";
        submitParent.style.display = "none";
    });
    
});