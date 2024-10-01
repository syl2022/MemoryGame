let timer;
let timeElapsed = 0;

export function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        updateTimerDisplay();
    }, 1000); // Update every second
}

export function stopTimer(){
    clearInterval(timer);
}
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerElement.innerText = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
