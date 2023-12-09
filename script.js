let button = document.querySelector('#Start_Button');
let intervalId = null;
let startTime = null;
let timerDuration = 20 * 60; // 20 minutes in seconds

// Function to update button text to show remaining time
function updateButtonText() {
    let now = new Date();
    let elapsedTime = Math.floor((now - startTime) / 1000); // in seconds
    let remainingTime = timerDuration - elapsedTime;

    if (remainingTime <= 0) {
        // Time's up
        clearInterval(intervalId);
        button.textContent = 'Start!';
    } else {
        button.textContent = `Remaining time: ${remainingTime} seconds`;
    }
}

button.addEventListener('click', function () {
    // Check if a timer is already running
    chrome.storage.local.get(['startTime', 'intervalId'], function(result) {
        if (result.startTime && result.intervalId) {
            // Timer is already running, continue the timer
            startTime = new Date(result.startTime);
            intervalId = result.intervalId;
            updateButtonText();
        } else {
            // Start the timer
            startTime = new Date();
            intervalId = setInterval(updateButtonText, 1000); // Update every second

            // Store the start time and interval ID
            chrome.storage.local.set({ 'startTime': startTime, 'intervalId': intervalId });
        }
    });
});