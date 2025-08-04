interface TrackInfosProps {
  track: {
    title: string;
    artist: string;
    artworkUrl: string;
    isFavorite: boolean;
  };
}

function TrackInfos({ track }: TrackInfosProps) {
  const favoriteIconClass = track.isFavorite ? 'bi-star-fill' : 'bi-star';
  
  return (
    <div className='left-infos'>
      <img src={track.artworkUrl} alt={track.title} />
      <div className='item-infos'>
        <div className='title-name'>{track.title}</div>
        <div className='artist-name'>{track.artist}</div>
      </div>
      <i className={`bi ${favoriteIconClass}`}></i>
    </div>
  );
};

export default TrackInfos;