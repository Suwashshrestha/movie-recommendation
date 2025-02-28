import { useState} from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { createFavoriteMovie } from "~/utils/api";
import { getFavoriteMovie } from "~/utils/api";
import { useEffect } from "react";


export function FavoriteIcon  ({movieId}: {movieId: number}) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
      console.log("Favorite clicked inside favorite Item");
        e.preventDefault();
        setIsFavorite(!isFavorite);
        console.log("favorite clicked");
            try {
              await createFavoriteMovie(movieId);
              setIsFavorite(!isFavorite);
            } catch (error) {
              console.error('Error updating favorite:', error);
            }
        // TODO: Add API call to update favorites
      };
    useEffect(() => {
      getFavoriteMovie(movieId).then((response) => {
        console.log("response from getFavoriteMovie", response);
        setIsFavorite(response.isFavorite);
      });
    }
    , [movieId]);
    
     
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


