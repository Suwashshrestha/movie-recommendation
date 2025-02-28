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
          <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
          <div className="text-center">
            <svg
              className="mx-auto h-40 w-40 animate-bounce"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M412.8 121.6c-18.2-22.4-47.2-35.2-77.8-35.2-10.6 0-21 1.6-30.8 4.6C291.4 69.8 265 54.4 236 54.4c-29 0-55.4 15.4-68.2 37.6-9.8-3-20.2-4.6-30.8-4.6-30.6 0-59.6 12.8-77.8 35.2C41.8 146.4 32 180 32 216c0 36 9.8 69.6 27.2 94.4 18.2 22.4 47.2 35.2 77.8 35.2 10.6 0 21-1.6 30.8-4.6 12.8 22.2 39.2 37.6 68.2 37.6 29 0 55.4-15.4 68.2-37.6 9.8 3 20.2 4.6 30.8 4.6 30.6 0 59.6-12.8 77.8-35.2 17.4-24.8 27.2-58.4 27.2-94.4 0-36-9.8-69.6-27.2-94.4z"
                fill="#FFE5B3"
              />
              <path
                d="M236 378.6c-29 0-55.4-15.4-68.2-37.6-9.8 3-20.2 4.6-30.8 4.6-30.6 0-59.6-12.8-77.8-35.2C41.8 285.6 32 252 32 216h408c0 36-9.8 69.6-27.2 94.4-18.2 22.4-47.2 35.2-77.8 35.2-10.6 0-21-1.6-30.8-4.6-12.8 22.2-39.2 37.6-68.2 37.6z"
                fill="#FFD782"
              />
              <circle cx="137" cy="216" r="20" fill="#FF6B6B" className="animate-ping"/>
              <circle cx="236" cy="216" r="20" fill="#FF6B6B" className="animate-ping [animation-delay:150ms]"/>
              <circle cx="335" cy="216" r="20" fill="#FF6B6B" className="animate-ping [animation-delay:300ms]"/>
            </svg>
            
            <h1 className="mt-8 text-4xl font-bold text-white">
              Loading Ratings...
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Grab your popcorn! 🍿
              <br />
              We're getting your ratings ready.
            </p>
            
            <div className="mt-8 flex justify-center space-x-2">
              <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:0ms]"></div>
              <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]"></div>
              <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]"></div>
            </div>
          </div>
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