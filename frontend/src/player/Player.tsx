import TrackInfos from './TrackInfos.tsx';
import PlayerControls from './PlayerControls.tsx';
import PlayerVolume from './PlayerVolume.tsx';
import './Player.css';

function Player() {
  // manage track playback here
  // could use useState by passing data as props
  const currentTrack = {
    title: 'Radiance',
    artist: 'Tim Hecker',
    artworkUrl: 'https://ia800305.us.archive.org/15/items/mbid-f1dd454a-6705-4828-97d8-57a423451c06/mbid-f1dd454a-6705-4828-97d8-57a423451c06-35311231946_thumb500.jpg',
    duration: '3:22',
    isFavorite: false,
  };

  return (
    <div className='bottom-player'>
      <audio src=""></audio>
      <TrackInfos track={currentTrack} />
      <PlayerControls duration={currentTrack.duration} />
      <PlayerVolume />
    </div>
  );
};

export default Player;