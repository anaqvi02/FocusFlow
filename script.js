
const startButton = document.getElementById('Start_Button');


const pomodoroCount = document.getElementById('pomodoroCount');

const stopButton = document.getElementById('Stop_Button');


let duration = 5;
let intervalId = null;
let pomodoros = 0;
let isbreaktime = false;
let breaktimeset = false

startButton.addEventListener('click', function() {
    chrome.storage.local.set({ isRunning: true, duration: duration, pomodoros: pomodoros, isbreaktime:isbreaktime});

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(startTimer, 1000);
});


stopButton.addEventListener('click', function() {
    chrome.storage.local.set({ isRunning: false, duration: duration, pomodoros: pomodoros, isbreaktime:isbreaktime});

    if (intervalId) {
        clearInterval(intervalId);
    }
});



function startTimer() {
    chrome.storage.local.get(['isRunning', 'duration', 'pomodoros'], function(result) {
        if (result.isRunning) {
            if (isbreaktime) {
                clearInterval(intervalId);
                intervalId = setInterval(startTimer, 1000);
                result.pomodoros++;
                chrome.storage.local.set({ pomodoros: result.pomodoros });

                pomodoroCount.textContent = 'Pomodoros: ' + result.pomodoros;
                if (breaktimeset == false) {
                if (result.pomodoros % 4 === 0) {
                    breaktimeset = true;
                    result.duration = 5;
                } else {
                    breaktimeset = true;
                    result.duration = 5;

                }}

                chrome.storage.local.set({duration: result.duration});


                minutes = Math.floor(result.duration / 60);
                seconds = result.duration % 60;

                startButton.textContent = 'Break Time left: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                result.duration--;
                if(minutes <= 0 && seconds <= 0){
                    isbreaktime=false;
                    result.duration = 10
                }
                chrome.storage.local.set({ duration: result.duration,isbreaktime:isbreaktime});
                
            } 
            
            if(isbreaktime===false) {

                minutes = Math.floor(result.duration / 60);
                seconds = result.duration % 60;

                startButton.textContent = 'Time left: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                result.duration--;
                if(minutes <= 0 && seconds <= 0){
                    isbreaktime=true;
                }
                chrome.storage.local.set({ duration: result.duration,isbreaktime:isbreaktime});
            }

         }
    });
}

chrome.storage.local.get(['isRunning', 'duration', 'pomodoros'], function(result) {
    if (result.isRunning) {
        duration = result.duration;
        pomodoros = result.pomodoros;

        if (intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(startTimer, 1000);
    }
});