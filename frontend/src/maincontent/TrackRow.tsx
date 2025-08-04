export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  isFavorite: boolean;
}

interface TrackRowProps {
    track: Track
}

export function TrackRow({track}: TrackRowProps) {
  const favoriteIconClass = track.isFavorite ? 'bi-star-fill' : 'bi-star';
  
  return (
    <div className='track-container'>
      <div className='favorite-button'><i className={`bi ${favoriteIconClass}`}></i></div>
      <div className='track-title'>{track.title}</div>
      <div className='track-artist'>{track.artist}</div>
      <div className='track-album'>{track.album}</div>
      <div className='track-duration'>{track.duration}</div>
    </div>
  );
};