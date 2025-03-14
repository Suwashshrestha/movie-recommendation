import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getTrendingMovies, type MovieTrending } from '../utils/api';

export const meta: MetaFunction = () => {
  return [
    { title: "CineMatch - Find Your Perfect Movie Match" },
    { name: "description", content: "Discover movies tailored to your taste with CineMatch's intelligent recommendation system" },
  ];
};

export default function Index() {
  const [currentMovieSet, setCurrentMovieSet] = useState(0);
  const [moviesTrend, setTrendMovies] = useState<MovieTrending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const moviesPerSet = 4;
  const [error, setError] = useState<string | null>(null);

  // State for trending movies carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        console.log('Fetching trending movies...');
        const data = await getTrendingMovies();
        console.log('Full API Response:', data);

        // Ensure data.results is defined, otherwise default to an empty array
        setTrendMovies(data.results);
      } catch (err) {
        console.error('Error fetching trending movies:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Auto-rotate movies in the hero section
  useEffect(() => {
    const interval = setInterval(() => {
      if (moviesTrend.length > 0) {
        setCurrentMovieSet(prev => (prev + 1) % Math.ceil(moviesTrend.length / moviesPerSet));
      }
    }, 2000); // Slightly longer interval for better viewing

    return () => clearInterval(interval);
  }, [moviesTrend]);

  // Get the current set of movies for the hero section
  const getCurrentMovies = () => {
    const startIndex = currentMovieSet * moviesPerSet;
    return moviesTrend.slice(startIndex, startIndex + moviesPerSet);
  };

  // Carousel navigation functions
  const nextSlide = () => {
    const totalSlides = Math.ceil(moviesTrend.length / 5);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(moviesTrend.length / 5);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-gray-900/90 z-10" />
        <div className="absolute inset-0 overflow-hidden md:flex gap-2 p-4 grid grid-cols-2">
          {!isLoading && getCurrentMovies().slice(0, 4).map((movie, index) => (
            <div
              key={movie.id}
              className="relative aspect-[2/3] w-full overflow-hidden rounded-lg"
            >
              <img
                src={movie.posterUri || '/movie_poster.jpeg'}
                alt={movie.title}
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out hover:scale-110"
                style={{
                  transform: `scale(${1 + Math.random() * 0.05})`,
                  transition: 'transform 20s ease-in-out'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
                      opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                  <h3 className="text-white text-xs md:text-base font-semibold truncate">
                    {movie.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Find Your Perfect Movie Match
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl mx-auto">
              Let our AI-powered recommendation engine guide you to your next favorite film
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/discover"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg transition-colors text-sm md:text-base"
              >
                Start Discovering
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Trending Movies</h1>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {moviesTrend && moviesTrend.length > 0 ? (
              moviesTrend.map((movie, index) => (
                <div key={movie.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 px-2">
                  <Link
                    to={`/movies/${movie.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 block"
                  >
                    <div className="relative aspect-[2/3]">
                      <img
                        src={movie.posterUri  || '/movie_poster.jpeg'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          
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
              ))
            ) : (
              <p className="text-center text-gray-500 ml-56">No movies found.</p>
            )}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon="🎯"
              title="Personalized Matches"
              description="Get movie recommendations tailored to your unique taste and preferences"
            />
            <FeatureCard
              icon="🌟"
              title="Curated Collections"
              description="Explore hand-picked collections of movies across different genres and themes"
            />
            <FeatureCard
              icon="🤖"
              title="Smart AI Engine"
              description="Our advanced AI learns from your choices to make better recommendations"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl transform transition-transform hover:scale-105">
      <div className="text-3xl md:text-4xl mb-4">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm md:text-base text-gray-400">{description}</p>
    </div>
  );
}