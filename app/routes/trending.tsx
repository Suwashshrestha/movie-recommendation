import { useEffect, useState } from 'react';
import { getTrendingMovies, TrendingMoviesResponse, MovieTrending } from '../utils/api'; 
import { Link } from "@remix-run/react";
import { MovieCard } from './discover';


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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            
            <MovieCard key={movie.id} movie={movie} />
          
          ))
        ) : (
          <p className="text-center text-gray-500">No movies found.</p>
        )}
      </div>
    </div>
  );
};
