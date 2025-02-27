import { useEffect, useState } from 'react';
import { getTrendingMovies, TrendingMoviesResponse, MovieTrending } from '../utils/api'; 
import { Link } from "@remix-run/react";


export default function TrendingPage() {

  const [movies, setMovies] = useState<MovieTrending[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        console.log('Fetching trending movies...');
        const data = await getTrendingMovies();
        console.log('Full API Response:', data);
  
        // Ensure data.results is defined, otherwise default to an empty array
        setMovies(data.results);
      } catch (err) {
        console.error('Error fetching trending movies:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTrendingMovies();
  }, []);
  

  if (loading) {
    return (
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
          
          
          <p className="mt-4 text-lg text-gray-400">
            Grab your popcorn! 🍿
            <br />
            We're getting Trending Movies......
          </p>
          
          <div className="mt-8 flex justify-center space-x-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:0ms]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Trending Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            
            <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
           
            className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
          >
            <div className="relative aspect-[2/3]">
              {/* Movie Poster */}
              <img
                src={movie.posterUri || 'https://via.placeholder.com/500x750'} // Fallback for missing poster
                alt={movie.title}
                className="w-full h-full object-cover"
              />
          
              {/* Favorite Icon */}
            
          
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
              {/* Movie Details */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-300">
                    {movie.year || 'N/A'} {/* Fallback for missing year */}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-300">
                      {movie.avg_rating || 'N/A'} {/* Fallback for missing rating */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          
          ))
        ) : (
          <p className="text-center text-gray-500">No movies found.</p>
        )}
      </div>
    </div>
  );
};
