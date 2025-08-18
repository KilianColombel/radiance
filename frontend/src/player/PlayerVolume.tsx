import Slider from "rc-slider";
import "./Slider.css";

interface PlayerVolumeProps {
  cnt_currVolume : number;
  cnt_onVolumeChange : (newVolume: number) => void;
}

function PlayerVolume({cnt_currVolume, cnt_onVolumeChange} : PlayerVolumeProps) {
  const step = 0.01

  function handleVolume(value: number | number[]) {
    if(typeof value === "number") {
      cnt_onVolumeChange(value);
    }
    else {
      // shouldn't happen since there's only one handle...
      throw new Error("Wrong input type in the slider...")
    }
  }

  function handleScroll(event: React.WheelEvent<HTMLDivElement>) {
    if (event.deltaY < 0) {
      handleVolume(Math.min(cnt_currVolume + 0.1, 1))
    }
    else {
      handleVolume(Math.max(cnt_currVolume - 0.1, 0))
    }
  }

  return (
    <div className='right-controls' onWheel={(e) => handleScroll(e)}>
      <Slider value={cnt_currVolume} onChange={handleVolume} min={0} step={step} max={1}/>
      <i className="bi bi-plus-circle"></i>
      <i className="bi bi-music-note-list"></i>
    </div>
  );
};

export default PlayerVolume;