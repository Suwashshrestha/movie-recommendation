import { useState} from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";


export function FavoriteIcon  () {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
        // TODO: Add API call to update favorites
      };
    
     
  return (
    <div>
          <button
            onClick={handleFavoriteClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors group"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-white group-hover:text-red-500 transition-colors" />
            )}
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-black/75 backdrop-blur-sm text-white text-xs rounded whitespace-nowrap">
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </div>
            )}
          </button>
        </div>
  )
}


