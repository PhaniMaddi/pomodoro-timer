window.onload = function() {
  const controlButton = document.getElementById('control-btn');

  // binding event to start and stop button
  controlButton.addEventListener('click', function() {
    let workTime = document.getElementsByClassName('pom-work')[0].innerText || 25;
    let restTime = document.getElementsByClassName('pom-rest')[0].innerText || 05;

    if(this.innerHTML === 'start') {
      // Initiae the timer
      prepareTimer(workTime, restTime);
      this.innerHTML = 'stop';
    } else {
      this.innerHTML = 'start';
    }
  });

  // event binding for reset button
  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', function() {
    let initWork = '25:00';
    let initRest = '05:00';

    controlButton.innerHTML = 'start';
    
    document.getElementsByClassName('pom-work')[0].innerText = initWork;
    document.getElementsByClassName('pom-rest')[0].innerText = initRest;
  });

  const plusBtn = document.querySelectorAll('div.time .plus');
  
  for(let i = 0; i < plusBtn.length; i++) {
    plusBtn[i].addEventListener('click', function() {
      let timeValue = this.parentNode.childNodes[3].innerText;
      let replTime =  incrementCount(timeValue);
      this.parentNode.childNodes[3].innerText = replTime;
    });
  }

  const minBtn = document.querySelectorAll('div.time .minus');
  for(let i = 0; i < minBtn.length; i++) {
    minBtn[i].addEventListener('click', function() {
      let timeValue = this.parentNode.childNodes[3].innerText;
      let replTime = decrementCount(timeValue);
      this.parentNode.childNodes[3].innerText = replTime;
    });
  }

};

// Increase the timer count
function incrementCount(time) {
  let ipTime = time.split(':');
  let formatNum = parseInt(ipTime[0]);
  if(formatNum >= 0) {
    formatNum += 1;
  }

  ipTime[0] = ('0' + formatNum).slice(-2);
  
  return ipTime.join(':').toString();
}

// Decrease the timer count
function decrementCount(time) {
  let sTime = time.split(':');
  let formatNum = parseInt(sTime[0]);
  if(formatNum > 0) {
    formatNum -= 1;
  }
  
  sTime[0] = ('0' + formatNum).slice(-2);
  
  return sTime.join(':').toString();
}

// Prepare the timer wrapper
function prepareTimer(workTime, restTime) {
  let wTime = parseInt(workTime) * 60;
  let rTime = parseInt(restTime) * 60;
  
  let wTimeDisplay = document.getElementsByClassName('pom-work')[0];
  let rTimeDisplay = document.getElementsByClassName('pom-rest')[0];
  
  let refIntervalId = startTimer(wTime, wTimeDisplay, startRestTimer);
  
  function startRestTimer() {
    clearInterval(refIntervalId);
    manageClockPulse(true);
    var restIntervalId = startTimer(rTime, rTimeDisplay, finishActivity);

    function finishActivity() {
      clearInterval(restIntervalId);
      manageClockPulse(false);
    }
  }
}

// Timer init
function startTimer(duration, display, callback) {
  let timer = duration;
  let minutes = null;
  let seconds = null;

  var timerCircle = document.querySelectorAll('svg circle');
  timerCircle[0].style.animationDuration = timer + 's';
  
  let intervalId = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    display.textContent = minutes + ':' + seconds;

    if (--timer < 0) {
      callback();
    }

    document.getElementById('control-btn').addEventListener('click', function () {
      clearInterval(intervalId);
    });

  }, 1000);

  return intervalId;
}

// start or stop Clock Pluse
function manageClockPulse(start) {
  var pulseSvg = document.querySelectorAll("svg.pulse-svg .first-circle, svg.pulse-svg .second-circle, svg.pulse-svg .third-circle");
  if(start) {
    for (let i = 0; i < pulseSvg.length; i++) {
      pulseSvg[i].style.display = "block";
    }
  } else {
    for (let i = 0; i < pulseSvg.length; i++) {
      pulseSvg[i].style.display = "none";
    }
  }
}