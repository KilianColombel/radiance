import { useState } from 'react';
import TrackHeader from './TrackHeader.tsx';
import { type Track, TrackRow } from './TrackRow.tsx';
import './MainContent.css';

const initialTracks: Track[] = [
  { id: 1, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
  { id: 2, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
  { id: 3, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
  { id: 4, title: 'Radiance', artist: 'Tim Hecker', album: 'Virgins', duration: '3:22', isFavorite: false },
];

function MainContent() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);

  const handleToggleFavorite = (trackId: number) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? { ...track, isFavorite: !track.isFavorite }
          : track
      )
    );
  };

  return (
    <div className="main-container">
      <TrackHeader />
      {tracks.map((track) => (
        <TrackRow
          key={track.id}
          track={track}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
};

export default MainContent;