let domain = document.getElementById("domain");

let timerparent = document.getElementById("timerparent");
let hour = document.getElementById("hour");
let minute = document.getElementById("minute");

let submitParent = document.getElementById("submitparent");
let time = document.getElementById("input");
let button = document.getElementById("submit");

let hostname;
chrome.runtime.sendMessage({isPopup:true}, (response) => {
    hostname = response.hostname;
    domain.innerHTML = hostname;
    console.log(response.hostname);
    if(response.timerExists){
        timerparent.style.display = "block";
        submitParent.style.display = "none";
        minute.innerHTML = response.timeElapsed % 60;
        hour.innerHTML = response.timeElapsed;
    } else{
        timerparent.style.display = "none";
        submitParent.style.display = "block";
    }
});

button.addEventListener('click', () =>{
    chrome.runtime.sendMessage({
        isPopup : true,
        isAddingTimer: true,
        hostname: hostname,
        maxTime : button.value
    }, (response) => {
        minute.innerHTML = response.timeElapsed % 60;
        hour.innerHTML = (response.timeElapsed / 60);
        timerparent.style.display = "block";
        submitParent.style.display = "none";
    });
    
});