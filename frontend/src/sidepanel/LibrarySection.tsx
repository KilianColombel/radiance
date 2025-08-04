import LibraryItem from './LibraryItem';

const libraryItems = [
  { icon: 'bi-disc-fill', name: 'albums' },
  { icon: 'bi-person-fill', name: 'artists' },
  { icon: 'bi-people-fill', name: 'genres' },
  { icon: 'bi-music-note', name: 'titles' },
];

function LibrarySection() {
  return (
    <div className='library'>
      <div className='library-entry'><i className="bi bi-collection"></i><h1>library</h1></div>
      {libraryItems.map((item, index) => (
        <LibraryItem key={index} icon={item.icon} name={item.name} />
      ))}
    </div>
  );
};

export default LibrarySection;