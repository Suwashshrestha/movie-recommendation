import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchMovies } from '~/utils/api';

interface Movie {
  id: string;
  title: string;

  

  posterUri: string;
  rating: number;
  year: string;
  genre: string[];

}

export default function ReviewMovies() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      setCurrentMovie(movies[currentIndex]);
      setProgress((currentIndex / movies.length) * 100);
    }
  }, [currentIndex, movies]);

  const loadMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchMovies(1, 20); // Load 20 movies initially
      setMovies(response.results);
      setCurrentMovie(response.results[0]);
    } catch (error) {
      setError('Failed to load movies. Please try again.');
      console.error('Error loading movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = (rating: string) => {
    setSelectedRating(rating);
    // TODO: Submit rating to API
    setTimeout(() => {
      setSelectedRating(null);
      nextMovie();
    }, 500);
  };

  const nextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const skipMovie = () => {
    nextMovie();
  };

  const refreshMovie = async () => {
    await loadMovies();
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

  return (
    <div className="min-h-screen bg-gray-950 pt-20 flex justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="flex justify-between text-white mb-2">
          <span>Movies Rated</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-800 h-1 mb-8">
          <div
            className="bg-purple-500 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="">
          {currentMovie && (
            <>
              {/* Movie Card */}
              <div className="relative rounded-lg overflow-hidden w-full max-w-[260px] mx-auto">
                <div className="aspect-[2/3] relative">
                  <img

                    src={currentMovie.posterUri}

                    alt={currentMovie.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Movie Info Overlay */}
                <div className="absolute bottom-10 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-xl font-semibold text-center">{currentMovie.title}</h2>
                  <p className="text-gray-300 text-center">{currentMovie.year}</p>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={skipMovie}
                  className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <button
                  onClick={refreshMovie}
                  className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowPathIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Rating Bubbles */}
              {/* Rating Bubbles */}
              <div className=" mt-8 flex justify-center items-center gap-6">
                <button
                  onClick={() => handleRating('Awful')}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center 
        bg-gradient-to-br from-red-400 to-red-600 
        transition-all duration-300 hover:scale-110 active:scale-95 
        group hover:shadow-xl hover:shadow-red-500/25
        ${selectedRating === 'Awful'
                        ? 'ring-4 ring-red-400 ring-opacity-50 scale-110 shadow-lg shadow-red-500/30'
                        : ''}`}
                  >
                    <span className="text-2xl transform transition-transform group-hover:scale-125">😖</span>
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 
        ${selectedRating === 'Awful' ? 'text-red-400' : 'text-gray-400'}`}
                  >
                    Awful
                  </span>
                </button>

                <button
                  onClick={() => handleRating('Meh')}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center 
        bg-gradient-to-br from-yellow-400 to-yellow-600 
        transition-all duration-300 hover:scale-110 active:scale-95 
        group hover:shadow-xl hover:shadow-yellow-500/25
        ${selectedRating === 'Meh'
                        ? 'ring-4 ring-yellow-400 ring-opacity-50 scale-110 shadow-lg shadow-yellow-500/30'
                        : ''}`}
                  >
                    <span className="text-2xl transform transition-transform group-hover:scale-125">😐</span>
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 
        ${selectedRating === 'Meh' ? 'text-yellow-400' : 'text-gray-400'}`}
                  >
                    Meh
                  </span>
                </button>

                <button
                  onClick={() => handleRating('Good')}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center 
        bg-gradient-to-br from-green-400 to-green-600 
        transition-all duration-300 hover:scale-110 active:scale-95 
        group hover:shadow-xl hover:shadow-green-500/25
        ${selectedRating === 'Good'
                        ? 'ring-4 ring-green-400 ring-opacity-50 scale-110 shadow-lg shadow-green-500/30'
                        : ''}`}
                  >
                    <span className="text-2xl transform transition-transform group-hover:scale-125">😊</span>
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 
        ${selectedRating === 'Good' ? 'text-green-400' : 'text-gray-400'}`}
                  >
                    Good
                  </span>
                </button>

                <button
                  onClick={() => handleRating('Amazing')}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center 
        bg-gradient-to-br from-purple-400 to-purple-600 
        transition-all duration-300 hover:scale-110 active:scale-95 
        group hover:shadow-xl hover:shadow-purple-500/25
        ${selectedRating === 'Amazing'
                        ? 'ring-4 ring-purple-400 ring-opacity-50 scale-110 shadow-lg shadow-purple-500/30'
                        : ''}`}
                  >
                    <span className="text-2xl transform transition-transform group-hover:scale-125">🤩</span>
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 
        ${selectedRating === 'Amazing' ? 'text-purple-400' : 'text-gray-400'}`}
                  >
                    Amazing
                  </span>
                </button>
              </div>

              {/* Haven't Seen Button */}
              <button
                onClick={skipMovie}
                className="mt-8 w-full bg-gray-800/50 text-gray-300 py-3 rounded-lg 
    hover:bg-gray-700/50 transition-all duration-300 text-sm font-medium
    backdrop-blur-sm hover:text-white hover:shadow-lg"
              >
                Haven't Seen
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}