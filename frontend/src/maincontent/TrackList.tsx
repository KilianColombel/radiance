import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { type Track } from '../../../common/types.ts'
import './TrackList.css';
import TrackHeader from './TrackHeader.tsx';
import { TrackRow } from './TrackRow.tsx';


type SortOrder = 'asc' | 'desc';
export type SortKey = 'title' | 'artist' | 'album' | 'duration'; // keys to sort on


export interface SortConfig {
  key: SortKey | null;
  order: SortOrder;
}

interface TrackListProps {
  onTrackSelect: (id: number) => void;
}

function TrackList({ onTrackSelect } : TrackListProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, order: 'asc' });
  const { id } = useParams();

  function loadTracks(listID: string) {
    fetch(`http://localhost:1234/api/tracks`)
      .then(res => res.json())
      .then(data => setTracks(data));
  }

  useEffect(() => {
    if (id) {
      loadTracks(id);
    }
  }, [id])

  const sortedTracks = useMemo(() => {
    let sortableTracks = [...tracks];
    
    if (sortConfig.key !== null) {
      sortableTracks.sort((a, b) => {
        let comparison = 0;
        console.log(sortConfig['order'])
        if (sortConfig.key == 'duration') {
          const aValue = a['duration'];
          const bValue = b['duration'];
          comparison = aValue - bValue;
        }
        
        else {
          const sortKey = sortConfig.key == 'title' ? 'track_name' : sortConfig.key == 'artist' ? 'artist_folder' : 'album_folder';
          const aValue = a[sortKey];
          const bValue = b[sortKey];
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.order === 'asc' ? comparison : -comparison;
      });
    }
    return sortableTracks;
  }, [tracks, sortConfig]);

  // TODO this is broken
  /* function handleToggleFavorite(trackId: number) {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.track_id === trackId
          ? { ...track, isFavorite: !track.isFavorite }
          : track
      )
    );
  }; */

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
          key={track.track_id}
          track={track}
          onTrackClick={onTrackSelect}
          onToggleFavorite={() => {}}
        />
      ))}
    </div>
  );
};

export default TrackList;