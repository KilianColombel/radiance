import Slider from "rc-slider";
import "./Slider.css";

function PlayerVolume() {
  return (
    <div className='right-controls'>
      <Slider/>
      <i className="bi bi-plus-circle"></i>
      <i className="bi bi-music-note-list"></i>
    </div>
  );
};

export default PlayerVolume;