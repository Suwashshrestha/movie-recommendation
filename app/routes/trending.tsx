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
      <div className="flex min-h-screen items-center justify-center">
      <img 
    src="/loading.gif" 
    alt="Loading..."
    className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
  />
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
