import FavoriteIcon from '../misc/FavoriteIcon.tsx';

interface TrackInfosProps {
  track: {
    title: string;
    artist: string;
  };
  onToggleFavorite: () => void;
}

function TrackInfos({ track, onToggleFavorite } : TrackInfosProps) {
  return (
    <div className='left-infos'>
      <img src={""} alt={track.title} />
      <div className='item-infos'>
        <div className='title-name'>{track.title}</div>
        <div className='artist-name'>{track.artist}</div>
      </div>
      <FavoriteIcon 
        isFavorite={false} 
        onToggleFavorite={onToggleFavorite} 
      />
    </div>
  );
};

export default TrackInfos;