// In background.js
let intervalId = null;
let startTime = null;
let timerDuration = 20 * 60; // 20 minutes in seconds

// Function to update button text to show remaining time
function updateTime() {
    let now = new Date();
    let elapsedTime = Math.floor((now - startTime) / 1000); // in seconds
    let remainingTime = timerDuration - elapsedTime;
    if (remainingTime <= 0) {
        // Time's up
        clearInterval(intervalId);
        remainingTime = 'Start!';
    }

    chrome.runtime.sendMessage({action: 'updateTime', time: remainingTime});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleTimer') {
        if (intervalId === null) {
            // Start the timer
            startTime = new Date();
            intervalId = setInterval(updateTime, 1000);
        } else {
            // Stop the timer
            clearInterval(intervalId);
            intervalId = null;
        }
    }
});