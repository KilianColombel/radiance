import { useState, useMemo } from 'react';

import { type Track } from '../../../common/types.ts'
import './MainContent.css';
import TrackHeader from './TrackHeader.tsx';
import { TrackRow } from './TrackRow.tsx';
import { stringToSeconds } from '../misc/handleTime.ts';
import { useEffect } from 'react';


export type SortKey = keyof Omit<Track, 'id' | 'isFavorite'>; // keys to sort on
type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey | null;
  order: SortOrder;
}


function MainContent() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, order: 'asc' });

  function loadTracks() {
    fetch("http://localhost:1234/api/musiques/example-1")
      .then(res => res.json())
      .then(data => setTracks(data));
  }

  useEffect(() => {
    loadTracks();
  }, [])

  const sortedTracks = useMemo(() => {
    let sortableTracks = [...tracks];
    
    if (sortConfig.key !== null) {
      sortableTracks.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        let comparison = 0;
        
        // TODO figure this out...
        // extra step for duration : i don't know what format the duration will have so this is what i'll use for now
        if (sortConfig.key === 'duration') {
          comparison = stringToSeconds(aValue) - stringToSeconds(bValue);
        } 
        
        else {
          comparison = aValue.localeCompare(bValue);
        }

        return sortConfig.order === 'asc' ? comparison : -comparison;
      });
    }
    return sortableTracks;
  }, [tracks, sortConfig]);

  function handleToggleFavorite(trackId: number) {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? { ...track, isFavorite: !track.isFavorite }
          : track
      )
    );
  };

  function handleSort(key: SortKey) {
    let order: SortOrder = 'asc';
    let newKey: SortKey | null = key;

    // sort cycle : ascending > descending > none
    if (sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    } else if (sortConfig.key === key && sortConfig.order === 'desc') {
      newKey = null;
    }
    
    setSortConfig({ key: newKey, order });
  };

  return (
    <div className="main-container">
      <TrackHeader onSort={handleSort} sortConfig={sortConfig} />
      
      {sortedTracks.map((track) => (
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