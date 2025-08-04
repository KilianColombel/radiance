import Slider from 'rc-slider';
import './Slider.css';
import { useState } from 'react';

interface PlayerControlsProps {
  duration: number;
}

function PlayerControls({ duration }: PlayerControlsProps) {
  const [currPlaytime, setCurrPlaytime] = useState(0);

  function handlePlaytime(value: number) {
    setCurrPlaytime(value);
    // update stuff here
  }

  function formatTime(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='middle-controls'>
      <div className='controls-container'>
        <i className="bi bi-skip-start"></i>
        <i className="bi bi-play"></i>
        <i className="bi bi-skip-end"></i>
      </div>
      <div className='progress-slider'>
        <div>{formatTime(currPlaytime)}</div>
        <Slider 
          value={currPlaytime}
          // TODO no idea why there's a warning here...
          onChange={handlePlaytime}
          max={duration}
          min={0}
        />
        {/* duration = 100 : default slider max value */}
        <div>{formatTime(100)}</div>
      </div>
    </div>
  );
};

export default PlayerControls;