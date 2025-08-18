import Slider from 'rc-slider';

import './Slider.css';
import { secondsToString } from '../misc/handleTime';

interface PlayerControlsProps {
  cnt_duration: number;
  cnt_currTime: number;
  cnt_isPlaying: boolean;
  cnt_onPlayPause: () => void;
  cnt_onSkipStart: () => void;
  cnt_onSkipEnd: () => void;
  cnt_onProgressChange: (newTime: number) => void;
}

function PlayerControls({ 
  cnt_duration,
  cnt_currTime,
  cnt_isPlaying,
  cnt_onPlayPause,
  cnt_onSkipStart,
  cnt_onSkipEnd,
  cnt_onProgressChange
}: PlayerControlsProps) {

  function handlePlaytime(value: number | number[]) {
    if(typeof value === "number") {
      cnt_onProgressChange(value);
    }
    else {
      // shouldn't happen since there's only one handle...
      throw new Error("Wrong input type in the slider...")
    }
  }

  return (
    <div className='middle-controls'>
      <div className='controls-container'>
        <i className="bi bi-skip-start" onClick={cnt_onSkipStart}></i>
        <i className={`bi ${cnt_isPlaying ? 'bi-pause' : 'bi-play'}`} onClick={cnt_onPlayPause}></i>
        <i className="bi bi-skip-end" onClick={cnt_onSkipEnd}></i>
      </div>
      <div className='progress-slider'>
        <div>{secondsToString(cnt_currTime)}</div>
        <Slider 
          value={cnt_currTime}
          onChange={handlePlaytime}
          max={cnt_duration}
          min={0}
        />
        <div>{secondsToString(cnt_duration)}</div>
      </div>
    </div>
  );
};

export default PlayerControls;