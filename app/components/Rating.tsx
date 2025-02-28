import { useState, useEffect } from "react";
import { getUserRatingsIds, trackMovieInteraction } from "~/utils/api";

export default function Rating() {
    const [userRating, setUserRating] = useState<number>(0);

    const handleRating = async (rating: number) => {
        try {
          setUserRating(rating);
          await trackMovieInteraction(movie.id, 'RATE', rating);
        } catch (error) {
          console.error('Failed to save rating:', error);
        }
      };
      useEffect(() => {
        const fetchUserRatings = async () => {
          const userRatings = await getUserRatingsIds();
          console.log(userRatings);
        };
        fetchUserRatings();
      }, []);
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5,7,8,9,10].map((star) => (
                <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <svg
                        className={`w-8 h-8 ${userRating >= star
                            ? "text-yellow-400"
                            : "text-gray-600 hover:text-yellow-300"
                            } transition-colors duration-200`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    )

}