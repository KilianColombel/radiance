import TrackHeader from './TrackHeader';
import { type Track, TrackRow } from './TrackRow.tsx';
import './MainContent.css';


const tracks: Track[] = [
  { id: 1, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
  { id: 2, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
  { id: 3, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
  { id: 4, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
];

function MainContent() {
  return (
    <div className="main-container">
      <TrackHeader />
      {tracks.map((track) => (
        <TrackRow
          key={track.id}
          track={track}
        />
      ))}
    </div>
  );
};

export default MainContent;