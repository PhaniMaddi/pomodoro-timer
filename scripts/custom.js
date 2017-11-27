window.onload = function() {
  
  // binding event to start and stop button
  const controlButton = document.getElementById("control-btn");
  controlButton.addEventListener("click", function() {
    let workTime = document.getElementsByClassName("pom-work")[0].innerText || 25;
    let restTime = document.getElementsByClassName("pom-rest")[0].innerText || 05;

    if (this.innerHTML === "start") {
      // Initiate the timer
      prepareTimer(workTime, restTime);
      this.innerHTML = "stop";
    } else {
      Timer.stopTimer();
      this.innerHTML = "start";
    }
  });

  // event binding for reset button
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", function() {
    let initWork = "25:00";
    let initRest = "05:00";

    controlButton.innerHTML = "start";
    Timer.stopTimer();
    Timer.clockPulse(false);

    document.getElementsByClassName("pom-work")[0].innerText = initWork;
    document.getElementsByClassName("pom-rest")[0].innerText = initRest;
  });

  // event binding for increment time
  const incrementBtn = document.querySelectorAll("div.time .plus");
  for (let i = 0; i < incrementBtn.length; i++) {
    incrementBtn[i].addEventListener("click", function() {
      let timeValue = this.parentNode.childNodes[3].innerText;
      let replTime = Timer.varyTimerValue(timeValue, true);

      this.parentNode.childNodes[3].innerText = replTime;
    });
  }

  // event binding for decrement time
  const decrementBtn = document.querySelectorAll("div.time .minus");
  for (let i = 0; i < decrementBtn.length; i++) {
    decrementBtn[i].addEventListener("click", function() {
      let timeValue = this.parentNode.childNodes[3].innerText;
      let replTime = Timer.varyTimerValue(timeValue, false);

      this.parentNode.childNodes[3].innerText = replTime;
    });
  }
};

// Prepare the timer wrapper
function prepareTimer(workTime, restTime) {
  let wTime = parseInt(workTime) * 60;
  let rTime = parseInt(restTime) * 60;

  let wTimeDisplay = document.getElementsByClassName("pom-work")[0];
  let rTimeDisplay = document.getElementsByClassName("pom-rest")[0];

  let refIntervalId = Timer.start(wTime, wTimeDisplay, startRestTimer);

  function startRestTimer() {
    clearInterval(refIntervalId);
    Timer.clockPulse(true);
    let restIntervalId = Timer.start(rTime, rTimeDisplay, finishActivity);

    function finishActivity() {
      Timer.stopTimer(restIntervalId);
      Timer.clockPulse(false);
    }
  }
}

// Timer module
const Timer = (function() {
  let intervalId = null;

  function animateCircle(duration) {
    let timerCircle = document.querySelectorAll("svg circle");
    timerCircle[0].style.animationDuration = duration + "s";
  }

  const startTimer = function(duration, container, callback) {
    if (!duration || !container) {
      return;
    }

    let timer = duration;
    let minutes = null;
    let seconds = null;

    // Start clock animation
    animateCircle(timer);

    intervalId = setInterval(function() {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      container.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        clearTimerInterval(intervalId);
        callback();
      }
    }, 1000);
  };

  const resetClock = function(intervalId) {
    let initWork = "25:00";
    let initRest = "05:00";

    controlButton.innerHTML = "start";

    // TODO reset interval
    if (intervalId) {
      clearTimerInterval(intervalId);
    }

    document.getElementsByClassName("pom-work")[0].innerText = initWork;
    document.getElementsByClassName("pom-rest")[0].innerText = initRest;
  };

  const resetTimer = function() {
    // TODO
    if (intervalId) {
      clearTimerInterval(intervalId);
    }
  };

  const varyTimerValue = function(currentValue, increment) {
    let ipTime = currentValue.split(":");
    let formatNum = parseInt(ipTime[0]);

    if (increment) {
      if (formatNum >= 0) {
        formatNum += 1;
      }
    } else {
      if (formatNum > 0) {
        formatNum -= 1;
      }
    }

    ipTime[0] = ("0" + formatNum).slice(-2);
    return ipTime.join(":").toString();
  };

  const animateClockPulse = function(startPulse) {
    const pulseSvg = document.querySelectorAll("svg.pulse-svg .first-circle, svg.pulse-svg .second-circle, svg.pulse-svg .third-circle");
    if (startPulse) {
      for (let i = 0; i < pulseSvg.length; i++) {
        pulseSvg[i].style.display = "block";
      }
    } else {
      for (let i = 0; i < pulseSvg.length; i++) {
        pulseSvg[i].style.display = "none";
      }
    }
  };

  const clearTimerInterval = function(intId) {

    clearInterval(intId || intervalId);
  };

  return {
    start: startTimer,
    reset: resetTimer,
    resetClock: resetClock,
    varyTimerValue: varyTimerValue,
    stopTimer: clearTimerInterval,
    clockPulse: animateClockPulse,
  };
})();
