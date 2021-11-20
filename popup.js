let domain = document.getElementById("domain");
let hour = document.getElementById("hour");
let minute = document.getElementById("minute");

chrome.runtime.sendMessage({isPopup:true}, (response) => {
    domain.innerHTML = response.hostname;
});