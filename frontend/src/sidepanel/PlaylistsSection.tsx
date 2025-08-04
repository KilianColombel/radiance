import LibraryItem from './LibraryItem';

const playlists = [
  { icon: 'bi-music-note-list', name: 'playlist 1' },
  { icon: 'bi-music-note-list', name: 'playlist 2' },
  { icon: 'bi-music-note-list', name: 'playlist 3' },
  { icon: 'bi-music-note-list', name: 'playlist 4' },
];

function PlaylistsSection() {
  return (
    <div className='playlists'>
      <div className='library-entry'>
        <i className="bi bi-collection-play"></i>
        <h1>playlists</h1>
      </div>
      {playlists.map((playlist, index) => (
        <LibraryItem key={index} icon={playlist.icon} name={playlist.name} />
      ))}
    </div>
  );
};

export default PlaylistsSection;