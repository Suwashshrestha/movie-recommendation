import { useEffect, useState } from 'react';
import { getMovieById, type MovieSearch } from "~/utils/api";
import { fetchAndCacheWatchList } from '../utils/api';
import { Link } from '@remix-run/react';
const WatchListPage = () => {
  const [watchList, setWatchList] = useState<{ movieIds: number; userFavoriteId: number }[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const movies = await fetchAndCacheWatchList();
        setWatchList(movies);
        await fetchMovieDetails(movies);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch watchlist');
        setLoading(false);
      }
    };

    const fetchMovieDetails = async (movies: { movieIds: number; userFavoriteId: number }[]) => {
      try {
        const details = await Promise.all(
          movies.map(async (movie) => {
            const response = await getMovieById(String(movie.movieIds));
            console.log("response from getMovieById", response);
            return response;
          })
        );
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchWatchList();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen  items-center justify-center ">
    <img 
src="/loading.gif" 
alt="Loading..."
className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
/>
</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-white mb-8">My Watchlist</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movieDetails.map((movie, index) => (
        <div key={watchList[index].userFavoriteId} className="relative">
          <Link
            to={`/movies/${movie.id}`}
            className="block bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
          >
            {/* Movie Poster */}
            <div className="relative aspect-[2/3]">
              <img
                src={movie.posterUri || 'https://via.placeholder.com/500x750'}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x750'; // Fallback for broken images
                }}
              />
  
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  
              {/* Movie Details */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white truncate">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-300">
                    {movie.year || 'N/A'}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-300">
                      {movie.avg_rating || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
  </div>
  );
};

export default WatchListPage;