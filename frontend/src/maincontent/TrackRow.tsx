import { useState, useRef } from 'react';

import { type Track } from '../../../common/types.ts'
import FavoriteIcon from '../misc/FavoriteIcon.tsx';


interface TrackRowProps {
    track: Track;
    onToggleFavorite: (trackId: number) => void;
}

export function TrackRow({track, onToggleFavorite}: TrackRowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlayPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggle = () => {
    onToggleFavorite(track.id);
  };

  const audioSrc = `http://localhost:1234/api/audio/${track.id}`;
  
  return (
    <div className='track-container'>
      <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)}></audio>

      <FavoriteIcon
        isFavorite={track.isFavorite}
        onToggleFavorite={handleToggle}
      />
      <div className='play-container' onClick={togglePlayPause}>
        <div className='track-title'>{track.title}</div>
        <div className='track-artist'>{track.artist}</div>
        <div className='track-album'>{track.album}</div>
        <div className='track-duration'>{track.duration}</div>
      </div>
    </div>
  );
};