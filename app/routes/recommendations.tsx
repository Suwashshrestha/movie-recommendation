import { useState, useEffect } from "react";
import { getRecommendationsForUser, type MovieSearch , trackMovieInteraction } from "~/utils/api";
import { Link, useNavigate } from "@remix-run/react";
import { FavoriteIcon } from "../components/Favorite"
import { WatchlistIcon } from "../components/Watchlist"

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<MovieSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendationsForUser();
        setRecommendations(data.results);
        console.log('Recommendations:', data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]);

  const handleInteractionView = async (e) => {
    // e.preventDefault();
    if (!e.defaultPrevented)
      setLoading(true);
    try {
      await trackMovieInteraction(movie.id, 'VIEW');
    } catch (error) {
      console.error('Failed to track view interaction:', error);
      // Silently fail as this shouldn't block user navigation
    }
  };

  const handleInteractionFavorite = async () => {
    try {
      await trackMovieInteraction(movie.id, 'FAVORITE');
    } catch (error) {
      console.error('Failed ', error);
    }
  };

  const handleInteractionWatchlist = async () => {
    try {
      await trackMovieInteraction(movie.id, 'WATCHLIST');
    } catch (error) {
      console.error('Failed ', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-400 text-center mb-4">Please login to see your recommendations.</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="   px-4 py-2 text-base font-medium text-white bg-purple-600 
                           rounded-md hover:bg-purple-700 transition-colors text-center
                           shadow-lg shadow-purple-500/25"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h2 className="text-3xl font-semibold text-white mb-6 text-center">
        Your Recommendations
      </h2>
      {loading ? (
        <div className="flex items-center justify-center ">
          <img 
            src="/loading.gif" 
            alt="Loading..."
            className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
          />
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendations.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              onClick={handleInteractionView}
              className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={movie.posterUri || '/movie_poster.jpeg'}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => handleInteractionFavorite()}
                    className="cursor-pointer focus:outline-none"
                    aria-label="Add to favorites"
                  >
                    <FavoriteIcon movieId={Number(movie.id)} />
                  </button>
                </div>
                <div className="absolute top-4 left-4 z-10">
                  <button
                    onClick={handleInteractionWatchlist}
                    className="cursor-pointer focus:outline-none"
                    aria-label="Add to watchlist"
                  >
                    <WatchlistIcon movieId={Number(movie.id)} />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                     
                    <span className="text-sm text-gray-300">{movie.avg_rating}</span>
                    <span className="text-yellow-400">★</span>
                    </div>
                   
                    
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No recommendations available.</p>
      )}
    </div>
  );
}