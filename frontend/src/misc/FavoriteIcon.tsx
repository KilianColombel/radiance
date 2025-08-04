import { useState } from 'react';
import './FavoriteIcon.css';

interface FavoriteIconProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function FavoriteIcon({ isFavorite, onToggleFavorite } : FavoriteIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const iconClass = isFavorite ? 'bi-star-fill favorited' : isHovered ? 'bi-star-fill' : 'bi-star';

  return (
    <i 
      className={`bi ${iconClass} favorite-icon`} 
      onClick={onToggleFavorite}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      
    ></i>
  );
};

export default FavoriteIcon;