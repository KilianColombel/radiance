import FavoriteIcon from '../misc/FavoriteIcon.tsx';

interface TrackInfosProps {
  track: {
    title: string;
    artist: string;
    artworkUrl: string;
    isFavorite: boolean;
  };
  onToggleFavorite: () => void;
}

function TrackInfos({ track, onToggleFavorite } : TrackInfosProps) {
  return (
    <div className='left-infos'>
      <img src={track.artworkUrl} alt={track.title} />
      <div className='item-infos'>
        <div className='title-name'>{track.title}</div>
        <div className='artist-name'>{track.artist}</div>
      </div>
      <FavoriteIcon 
        isFavorite={track.isFavorite} 
        onToggleFavorite={onToggleFavorite} 
      />
    </div>
  );
};

export default TrackInfos;