// Timer.jsx
import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ startTime, endTime, onEnd }) => {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  
  useEffect(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    let remainingTime;

    if (startTime > currentTime) {
      remainingTime = startTime - currentTime;
    } else if (endTime > currentTime) {
      remainingTime = endTime - currentTime;
    } else {
      remainingTime = 0;
    }

    setTimer(remainingTime);

    if (remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(intervalRef.current);
            onEnd();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [startTime, endTime, onEnd]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Timer</h5>
        <p className="card-text">{formatTime(timer)}</p>
      </div>
    </div>
  );
};

export default Timer;
