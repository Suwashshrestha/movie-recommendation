import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { XMarkIcon, } from '@heroicons/react/24/outline';
import { getTrendingMovies, updateUserMoviePreferences, MovieTrending } from '../utils/api';

export default function ReviewMovies() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [movies, setMovies] = useState<MovieTrending[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      setProgress((currentIndex / movies.length) * 100);
    }
  }, [currentIndex, movies]);

  const loadMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTrendingMovies();
      setMovies(response.results);
    } catch (error) {
      setError('Failed to load movies. Please try again.');
      console.error('Error loading movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (rating: string) => {
    if (!movies[currentIndex]) return;

    setSelectedRating(rating);
    try {
      await updateUserMoviePreferences(movies[currentIndex].id, rating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setTimeout(() => {
        setSelectedRating(null);
        nextMovie();
      }, 500);
    }
  };

  const nextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate('/auth/login'); 
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <div className="text-white">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 flex justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between text-white mb-2">
          <span>Movies Rated</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-800 h-1 mb-8">
          <div className="bg-purple-500 h-1 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {currentMovie && (
          <>
            <div className="relative rounded-lg overflow-hidden w-full max-w-[260px] mx-auto">
              <div className="aspect-[2/3] relative">
                <img src={currentMovie.posterUri} alt={currentMovie.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-10 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-xl font-semibold text-center">{currentMovie.title}</h2>
                <p className="text-gray-300 text-center">{currentMovie.year}</p>
              </div>
              <button onClick={nextMovie} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 flex justify-center items-center gap-6">
              {['Awful', 'Meh', 'Good', 'Amazing'].map((rating, index) => (
                <button key={index} onClick={() => handleRating(rating)} className="flex flex-col items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center 
                    ${rating === 'Awful' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                      rating === 'Meh' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        rating === 'Good' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                          'bg-gradient-to-br from-purple-400 to-purple-600'}
                    transition-all duration-300 hover:scale-110 active:scale-95 
                    group hover:shadow-xl hover:shadow-opacity-25
                    ${selectedRating === rating ? 'ring-4 scale-110 shadow-lg' : ''}`}
                  >
                    <span className="text-2xl transform transition-transform group-hover:scale-125">
                      {rating === 'Awful' ? '😖' : rating === 'Meh' ? '😐' : rating === 'Good' ? '😊' : '🤩'}
                    </span>
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${selectedRating === rating ? 'text-opacity-50' : 'text-gray-400'}`}>
                    {rating}
                  </span>
                </button>
              ))}
            </div>

            <button onClick={nextMovie} className="mt-8 w-full bg-gray-800/50 text-gray-300 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:text-white hover:shadow-lg">
              Haven't Seen
            </button>
          </>
        )}
      </div>
    </div>
  );
}
