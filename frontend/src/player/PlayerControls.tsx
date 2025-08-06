import { useState } from 'react';
import Slider from 'rc-slider';

import './Slider.css';
import { secondsToString } from '../misc/handleTime';

interface PlayerControlsProps {
  duration: number;
}

function PlayerControls({ duration }: PlayerControlsProps) {
  const [currPlaytime, setCurrPlaytime] = useState(0);

  function handlePlaytime(value: number | number[]) {
    if(typeof value === "number") {
      setCurrPlaytime(value);
    }
    else {
      // shouldn't happend since there's only one handle...
      throw new Error("Wrong input time in the slider...")
    }

    // update stuff here
  }

  return (
    <div className='middle-controls'>
      <div className='controls-container'>
        <i className="bi bi-skip-start"></i>
        <i className="bi bi-play"></i>
        <i className="bi bi-skip-end"></i>
      </div>
      <div className='progress-slider'>
        <div>{secondsToString(currPlaytime)}</div>
        <Slider 
          value={currPlaytime}
          // TODO no idea why there's a warning here...
          onChange={handlePlaytime}
          max={duration}
          min={0}
        />
        {/* duration = 100 : default slider max value */}
        <div>{secondsToString(100)}</div>
      </div>
    </div>
  );
};

export default PlayerControls;