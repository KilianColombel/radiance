import { useState, useMemo } from 'react';

import './MainContent.css';
import TrackHeader from './TrackHeader.tsx';
import { type Track, TrackRow } from './TrackRow.tsx';
import { stringToSeconds } from '../misc/handleTime.ts';

const initialTracks: Track[] = [
  { id: 1, title: 'Island In The Sun', artist: 'Weezer', album: 'Weezer', duration: '3:20', isFavorite: false },
  { id: 2, title: 'Stuck In The Middle With You', artist: 'Stealers Wheel', album: 'Stealers Wheel', duration: '3:29', isFavorite: true },
  { id: 3, title: 'This Must Be the Place', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: '4:56', isFavorite: false },
  { id: 4, title: 'Cloud Nine', artist: 'George Harrison', album: 'Cloud Nine', duration: '3:17', isFavorite: false },
  { id: 5, title: 'Lovefool', artist: 'The Cardigans', album: 'First Band On The Moon', duration: '3:14', isFavorite: false },
];

export type SortKey = keyof Omit<Track, 'id' | 'isFavorite'>; // keys to sort on
type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey | null;
  order: SortOrder;
}


function MainContent() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, order: 'asc' });

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