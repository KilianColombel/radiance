import { useState } from 'react';

import './Player.css';
import TrackInfos from './TrackInfos.tsx';
import PlayerControls from './PlayerControls.tsx';
import PlayerVolume from './PlayerVolume.tsx';
import { type PlayerProps } from '../../../common/types.ts'

function Player({
  currTitle, currArtist, currDuration, currTime, currVolume, isPlaying, 
  onPlayPause, onSkipStart, onSkipEnd, onProgressChange, onVolumeChange
}: PlayerProps) {

  /* function handleToggleFavorite() {
    setCurrentTrack(prevTrack => ({
      ...prevTrack,
      isFavorite: !prevTrack.isFavorite
    }));
  }; */

  return (
    <div className='bottom-player'>
      <audio src=""></audio>
      <TrackInfos track={{title: currTitle, artist: currArtist}} onToggleFavorite={() => {}} />
      <PlayerControls 
        cnt_duration={currDuration} 
        cnt_currTime={currTime}
        cnt_isPlaying={isPlaying}
        cnt_onPlayPause={onPlayPause}
        cnt_onSkipStart={onSkipStart}
        cnt_onSkipEnd={onSkipEnd}
        cnt_onProgressChange={onProgressChange} />
      <PlayerVolume cnt_currVolume={currVolume} cnt_onVolumeChange={onVolumeChange}/>
    </div>
  );
};

export default Player;