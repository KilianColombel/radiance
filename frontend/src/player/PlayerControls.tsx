interface PlayerControlsProps {
  duration: string;
}

function PlayerControls({ duration }: PlayerControlsProps) {
  return (
    <div className='middle-controls'>
      <div className='controls-container'>
        <i className="bi bi-skip-start"></i>
        <i className="bi bi-play"></i>
        <i className="bi bi-skip-end"></i>
      </div>
      <div className='progress-slider'>
        <div>0:00</div>
        <input type="range" />
        <div>{duration}</div>
      </div>
    </div>
  );
};

export default PlayerControls;