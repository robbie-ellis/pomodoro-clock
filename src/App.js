import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const INITIAL_SESSION_LENGTH = 25;
  const INITIAL_BREAK_LENGTH = 5;

  const breakDecrementBtn = useRef(null);
  const breakIncrementBtn = useRef(null);
  const sessionDecrementBtn = useRef(null);
  const sessionIncrementBtn = useRef(null);
  const breakDisplay = useRef(null);
  const sessionDisplay = useRef(null);
  const sessionOrBreakText = useRef(null);
  const timeLeftDisplay = useRef(null);
  const startStopDisplay = useRef(null);
  const beepSound = useRef(null);

  const [breakLength, setBreakLength] = useState(INITIAL_BREAK_LENGTH);
  const [sessionLength, setSessionLength] = useState(INITIAL_SESSION_LENGTH);
  const [timeLeftMin, setTimeLeftMin] = useState(INITIAL_SESSION_LENGTH);
  const [timeLeftSec, setTimeLeftSec] = useState(0);
  const [paused, setPaused] = useState(true);
  const [onBreak, setOnBreak] = useState(false);
  
  const playSound = () => {
    if (beepSound.current) {
      beepSound.current.play();
      setTimeout(() => {
        stopAndRewindSound();
      }, beepSound.current.duration * 1000);
    }
  };

  const stopAndRewindSound = () => {
    if (beepSound.current) {
      beepSound.current.pause();
      beepSound.current.currentTime = 0;
    }
  };

  // session and break text updater
  useEffect(() => {
    if (!onBreak) {
      sessionOrBreakText.current.innerText = 'Session';
    } else {
      sessionOrBreakText.current.innerText = 'Break';
    }
  }, [onBreak]);

  // countdown functionality
  useEffect(() => {
    /* 
    minutes and seconds variables are used here becuase, while this 
    useEffect is running, it won't have access to the timeLeftMin and 
    timeLeftSec states.  This could be rememdied by adding them to the 
    dependency array, but that would be inefficient since it would 
    cause this useEffect to unmount and remount every second. 
    */ 

    let minutes = timeLeftMin;
    let seconds = timeLeftSec;
    if (!paused && (minutes > 0 || seconds > 0)) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setTimeLeftSec((prevTimeLeftSec) => prevTimeLeftSec - 1);
          seconds--;
        } else if (seconds === 0 && minutes > 0) {
          setTimeLeftMin((prevTimeLeftMin) => prevTimeLeftMin - 1);
          setTimeLeftSec(() => 59);
          minutes--;
          seconds = 59;
        } else if (seconds === 0 && minutes === 0) {
          playSound();
          setPaused(true);
          setOnBreak((prevOnBreak) => !prevOnBreak);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paused, onBreak]);

  // break functionality
  useEffect(() => {
    if (timeLeftMin === 0 && timeLeftSec === 0) {
      if (onBreak) {
        setTimeLeftMin(breakLength);
        setTimeLeftSec(0);
      } else {
        setTimeLeftMin(sessionLength);
        setTimeLeftSec(0);
      }
      setPaused(false);
    }
  }, [onBreak]);
  
  //displays time left in the countdown clock.
  useEffect(() => {
    let minutes = "";
    let seconds = "";
    
    if (timeLeftMin < 10) {
      minutes = `0${timeLeftMin}`;
    } else {
      minutes = `${timeLeftMin}`;
    }
    
    if (timeLeftSec < 10) {
      seconds = `0${timeLeftSec}`;
    } else {
      seconds = `${timeLeftSec}`;
    }
  
    timeLeftDisplay.current.innerText = `${minutes}:${seconds}`;
    timeLeftDisplay.current.value = `${minutes}:${seconds}`;
  }, [timeLeftMin, timeLeftSec]);

  //handles pausing and resuming
  function startOrPause() {
    setPaused((prevPaused) => !prevPaused);
    startStopDisplay.current.innerText = paused ? "Pause" : "Start";
  }

  //resets the timer
  function reset() {
    setPaused(true);
    setBreakLength(INITIAL_BREAK_LENGTH);
    setSessionLength(INITIAL_SESSION_LENGTH);
    setTimeLeftMin(INITIAL_SESSION_LENGTH);
    setTimeLeftSec(0);
    setOnBreak(false);
    stopAndRewindSound();
    startStopDisplay.current.innerText = "Start";
    sessionOrBreakText.current.innerText = "Session";
  }

  //handles decrement and increment buttons
  useEffect(() => {
    const breakDec = breakDecrementBtn.current;
    const breakInc = breakIncrementBtn.current;
    const sessionDec = sessionDecrementBtn.current;
    const sessionInc = sessionIncrementBtn.current;
    // breakDec is used here just to make sure the button elements have loaded 
    if (breakDec) {
      const handleClick = (event) => {
        const button = event.target.id;
        switch (button) {
          case "break-decrement":
            setBreakLength((prevBreakLength) => {
              if (prevBreakLength > 1) {
                return prevBreakLength - 1;
              }
              return prevBreakLength;
            });
            break;
          case "break-increment":
            setBreakLength((prevBreakLength) => {
              if (prevBreakLength < 60) {
                return prevBreakLength + 1;
              }
              return prevBreakLength;
            });
            break;
          case "session-decrement":
            setSessionLength((prevSessionLength) => {
              if (prevSessionLength > 1) {
                return prevSessionLength - 1;
              }
              return prevSessionLength;
            });
            break;
          case "session-increment":
            setSessionLength((prevSessionLength) => {
              if (prevSessionLength < 60) {
                return prevSessionLength + 1;
              }
              return prevSessionLength;
            });
            break;
        } 
      }
      breakDec.addEventListener('click', handleClick);
      breakInc.addEventListener('click', handleClick);
      sessionDec.addEventListener('click', handleClick);
      sessionInc.addEventListener('click', handleClick);
      return () => {
        breakDec.removeEventListener('click', handleClick);
        breakInc.removeEventListener('click', handleClick);
        sessionDec.removeEventListener('click', handleClick);
        sessionInc.removeEventListener('click', handleClick);
      };
    }
  }, []);

  //displays results of using increment or decrement buttons
  useEffect(() => {
    breakDisplay.current.innerText = breakLength;
    sessionDisplay.current.innerText = sessionLength;
    setTimeLeftMin(sessionLength);
  }, [breakLength, sessionLength]);

  return (
    <div className='outer-border container scale-down'>
      <h1 className='App-header'>Pomodoro Clock</h1>
      <div className='row'>
        <div className='col-6'><label id='break-label'>Break Length</label></div>
        <div className='col-6'><label id='session-label'>Session Length</label></div>
      </div>
      <br/>
      <div className='row'>
        <div className='col-2'><button className='button' id='break-decrement' ref={breakDecrementBtn}>-</button></div>
        <div className='col-2 remove-padding'><label id='break-length' ref={breakDisplay} value='5'>5</label></div>
        <div className='col-2'><button className='button' id='break-increment' ref={breakIncrementBtn}>+</button></div>
        <div className='col-2'><button className='button' id='session-decrement' ref={sessionDecrementBtn}>-</button></div>
        <div className='col-2 remove-padding'><label id='session-length' ref={sessionDisplay} value='25'>25</label></div>
        <div className='col-2'><button className='button' id='session-increment' ref={sessionIncrementBtn}>+</button></div>
      </div>
      <br/>
      <br/>
      <div className='timer-border'>
        <div className='row remove-margin'>
          <div className='col-4 center-margins-vert'><button id='start_stop' onClick={startOrPause} className="button" ref={startStopDisplay} value="Start">Start</button></div>
          <div className='col-4'>
            <h2 id='timer-label' className=' timer-display timer-header' ref={sessionOrBreakText}>Session</h2>
            <h1 id='time-left' className='timer-display' ref={timeLeftDisplay} value="25:00">25:00</h1>
          </div>
          <div className='col-4 center-margins-vert'><button id='reset' onClick={reset} className='button'>Reset</button></div>
        </div>
      </div>
      <audio id='beep' ref={beepSound} src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'></audio>
      <br/>
    </div>
  );
}

export default App;
