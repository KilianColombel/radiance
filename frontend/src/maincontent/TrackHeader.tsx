import { type SortConfig, type SortKey } from './MainContent.tsx'; 

interface TrackHeaderProps {
  onSort: (key: SortKey) => void;
  sortConfig: SortConfig;
}

function TrackHeader({ onSort, sortConfig }: TrackHeaderProps) {

  function getSortIcon(key: SortKey) {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.order === 'asc') {
      return <i className="bi bi-chevron-down"></i>;
    }
    return <i className="bi bi-chevron-up"></i>;
  };

  return (
    <div className='track-container sort-container'>
      <div></div>

      <div className={`sort-title ${sortConfig.key === 'title' ? 'sorted' : ''}`.trim()} onClick={() => onSort('title')}>
        {getSortIcon('title')}
        <span>title</span>
      </div>

      <div className={`sort-artist ${sortConfig.key === 'artist' ? 'sorted' : ''}`.trim()} onClick={() => onSort('artist')}>
        {getSortIcon('artist')}
        <span>artist</span>
      </div>

      <div className={`sort-album ${sortConfig.key === 'album' ? 'sorted' : ''}`.trim()} onClick={() => onSort('album')}>
        {getSortIcon('album')}
        <span>album</span>
      </div>

      <div className={`sort-duration ${sortConfig.key === 'duration' ? 'sorted' : ''}`.trim()} onClick={() => onSort('duration')}>
        {getSortIcon('duration')}
        <i className="bi bi-clock"></i>
      </div>
    </div>
  );
};

export default TrackHeader;