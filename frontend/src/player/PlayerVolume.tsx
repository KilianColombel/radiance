import Slider from "rc-slider";
import "./Slider.css";

interface PlayerVolumeProps {
  cnt_currVolume : number;
  cnt_onVolumeChange : (newVolume: number) => void;
}

function PlayerVolume({cnt_currVolume, cnt_onVolumeChange} : PlayerVolumeProps) {
  function handleVolume(value: number | number[]) {
    if(typeof value === "number") {
      cnt_onVolumeChange(value);
    }
    else {
      // shouldn't happen since there's only one handle...
      throw new Error("Wrong input type in the slider...")
    }
  }

  return (
    <div className='right-controls'>
      <Slider value={cnt_currVolume} onChange={handleVolume} min={0} step={0.01} max={1}/>
      <i className="bi bi-plus-circle"></i>
      <i className="bi bi-music-note-list"></i>
    </div>
  );
};

export default PlayerVolume;