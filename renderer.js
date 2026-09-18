const { ipcRenderer } = require('electron');
document.getElementById('minimizeBtn').addEventListener('click',()=>{
    ipcRenderer.send('minimize-window');
});
document.getElementById('closeBtn').addEventListener('click',()=>{
    ipcRenderer.send('close-window');
});
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeLabel = document.getElementById('modeLabel');
const timerDisplay = document.getElementById('timerDisplay');
const sessionCount = document.getElementById('sessionCount');
const ringProgress = document.getElementById('ringProgress');
const FULL_DASH = 628;
/*const DURATIONS = {
    'focus': 5,
    'short': 3,
    'long': 4
}*/
const DURATIONS = {
    'focus': 25*60,
    'short': 5*60,
    'long': 10*60
}
let currentMode = 'focus';
let secondsLeft = DURATIONS[currentMode];
let timerInterval = null;
let sessionCompleted = 0;
function updateTimeDisplay(){
    const seconds = secondsLeft % 60;
    const minutes = Math.floor(secondsLeft / 60);
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function updateSessionCount(){
    sessionCount.textContent = sessionCompleted;
}
function setTimerInterval(){
    if(timerInterval !== null)
        return;
     timerInterval = setInterval(()=>{
        if(secondsLeft > 0){
            secondsLeft --;
            updateTimeDisplay();
            updateRing();
        } else{            
            clearTimerInterval();
            handleTimerComplete();         
        }
     },1000);
}
function clearTimerInterval(){
    clearInterval(timerInterval);
    timerInterval = null;
}
function handleTimerComplete(){
    if(currentMode === 'focus'){
        sessionCompleted++;
        updateSessionCount();
        if(sessionCompleted % 4 === 0){
            setMode('long');
        } else{
            setMode('short');
        }
    } else if (currentMode === 'short'){
        setMode('focus');        
    } else if (currentMode === 'long'){
        setMode('focus');
    }
    setTimerInterval();
}
function setMode(modeVar){
    clearTimerInterval();
    currentMode = modeVar;
    secondsLeft = DURATIONS[modeVar];
    modeLabel.textContent = modeVar === 'focus'? 'Focus' : modeVar === 'short' ? 'Short Break' : 'Long Break';
    updateTimeDisplay();
    updateRing();
       
}
function updateRing(){
    const totalDuration = DURATIONS[currentMode];
    const fractionElapsed = (totalDuration - secondsLeft)/totalDuration;
    const offset = FULL_DASH * fractionElapsed;
    ringProgress.style.strokeDashoffset = offset;
}
startBtn.addEventListener('click',()=>{
    setTimerInterval();
})

pauseBtn.addEventListener('click',()=>{
    clearTimerInterval();
})

resetBtn.addEventListener('click',()=>{
    clearTimerInterval();
    secondsLeft = DURATIONS[currentMode];
    updateTimeDisplay();
    updateRing();
})

const shortBrkBtn = document.getElementById('shortBreakBtn');
const longBrkBtn = document.getElementById('longBreakBtn');
const focusBtn = document.getElementById('focusBtn');
focusBtn.addEventListener('click',()=>setMode('focus'));
shortBrkBtn.addEventListener('click',()=>setMode('short'));
longBrkBtn.addEventListener('click',()=>setMode('long'));
