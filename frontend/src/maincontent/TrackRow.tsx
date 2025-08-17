import { useState, useRef } from 'react';

import { type Track } from '../../../common/types.ts'
import FavoriteIcon from '../misc/FavoriteIcon.tsx';
import { secondsToString } from '../misc/handleTime.ts';


interface TrackRowProps {
    track: Track;
    onTrackClick: (id: number) => number;
    onToggleFavorite: (trackId: number) => void;
}

export function TrackRow({track, onTrackClick, onToggleFavorite}: TrackRowProps) {
  
  function togglePlayPause() {
    onTrackClick(track.track_id)
  }
  

  const handleToggle = () => {
    onToggleFavorite(track.track_id);
  };
  
  return (
    <div className='track-container'>

      <FavoriteIcon
        isFavorite={false}
        onToggleFavorite={handleToggle}
      />
      <div className='play-container' onClick={togglePlayPause}>
        <div className='track-title'>{track.track_name}</div>
        <div className='track-artist'>{track.artist_folder}</div>
        <div className='track-album'>{track.album_folder}</div>
        <div className='track-duration'>{secondsToString(track.duration)}</div>
      </div>
    </div>
  );
};