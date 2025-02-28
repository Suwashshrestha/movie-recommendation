import { useEffect, useState } from 'react';
import { getUserRatings } from '~/utils/api';
import { Link } from '@remix-run/react';

interface Movie {
  id: number;
  ems_id: string;
  title: string;
  synopsis: string;
  director: string;
  rating: string;
  original_language: string;
  movie_index: number;
  tagline: string;
  genres: string[];
  cast: string[];
  avg_rating: string;
}

interface UserRating {
  id: number;
  movie: Movie;
  score: number;
  created_at: string;
  updated_at: string;
}

interface UserRatingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserRating[];
}

export default function UserRatings() {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [currentPage]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await getUserRatings(currentPage);
      setRatings(prev => currentPage === 1 ? response.results : [...prev, ...response.results]);
      setHasMore(!!response.next);
      console.log(response)
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       

        <h1 className="text-3xl font-bold text-white mb-8">My Ratings</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <Link to={`/movies/${rating.movie.id}`}>
                <div className="  bg-gray-700">
                 
                  <div className=" inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className=" bottom-0 left-0 right-0 p-4">
                    <h2 className="text-xl font-semibold text-white mb-2">{rating.movie.title}</h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-lg mr-1">★</span>
                        <span className="text-white">Your Rating: {rating.score}/10</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                {rating.movie.genres && rating.movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rating.movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {rating.movie.synopsis && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {rating.movie.synopsis}
                  </p>
                )}

                <div className="mt-3 text-sm text-gray-400">
                  {rating.movie.director && (
                    <div>Director: {rating.movie.director}</div>
                  )}
                  {rating.movie.avg_rating && (
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400 mr-1">★</span>
                      Average: {rating.movie.avg_rating}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex min-h-screen  items-center justify-center ">
            <img 
    src="/loading.gif" 
    alt="Loading..."
    className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
  />
        </div>
        )}

        {!loading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {!loading && ratings.length === 0 && !error && (
          <div className="text-center text-gray-400 mt-8">
            You haven't rated any movies yet.
          </div>
        )}
      </div>
    </div>
  );
}