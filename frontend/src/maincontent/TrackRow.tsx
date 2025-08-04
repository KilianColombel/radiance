import FavoriteIcon from '../misc/FavoriteIcon.tsx';

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  isFavorite: boolean;
}

interface TrackRowProps {
    track: Track;
    onToggleFavorite: (trackId: number) => void;
}

export function TrackRow({track, onToggleFavorite}: TrackRowProps) {
  const handleToggle = () => {
    onToggleFavorite(track.id);
  };
  
  return (
    <div className='track-container'>
      <FavoriteIcon
        isFavorite={track.isFavorite}
        onToggleFavorite={handleToggle}
      />
      <div className='track-title'>{track.title}</div>
      <div className='track-artist'>{track.artist}</div>
      <div className='track-album'>{track.album}</div>
      <div className='track-duration'>{track.duration}</div>
    </div>
  );
};