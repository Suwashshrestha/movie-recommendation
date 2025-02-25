import { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { fetchMovies } from "../utils/api";
=======
import { fetchMovies,trackMovieInteraction } from "../utils/api";

import { SearchBar } from "~/components/Searchbar";
import { Link } from "@remix-run/react";
import { FavoriteIcon } from "../components/Favorite"


>>>>>>> Stashed changes

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  rating: number;
  year: string;
  genre: string[];
}

function MovieCard({ movie }: { movie: Movie }) {
<<<<<<< Updated upstream
=======

  const handleInteractionView = async () => {
    try {
      await trackMovieInteraction(movie.id, 'VIEW');
    } catch (error) {
      console.error('Failed to track view interaction:', error);
      // Silently fail as this shouldn't block user navigation
    }
  };
  const handleInteractionFavorite = async () => {
    try {
        await trackMovieInteraction(movie.id, 'FAVORITE' );
    } catch (error){
        console.error('Failed ',error);
    }
    };
  
  
>>>>>>> Stashed changes
  return (
<Link
      to={`/movies/${movie.id}`} 
      onClick={handleInteractionView}
      
      className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
    >
      <div className="relative aspect-[2/3]">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
<<<<<<< Updated upstream
=======
        <div className="absolute top-4 right-4 z-10">
          {/* <button
            onClick={handleFavoriteClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors group"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-white group-hover:text-red-500 transition-colors" />
            )}
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-black/75 backdrop-blur-sm text-white text-xs rounded whitespace-nowrap">
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </div>
            )}
          </button> */}
          <div onClick={handleInteractionFavorite} style={{ cursor: "pointer"}}>
          <FavoriteIcon />
          </div>
        </div>
>>>>>>> Stashed changes
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-300">{movie.year}</span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-300">{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Discover() {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetchMovies(page, pageSize);
        console.log("Fetched Movies:", response);
        setMovies(response.results);
        setHasMore(!!response.next);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    loadMovies();
  }, [page]);

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  // Filter movies based on the selected genre
  const filteredMovies =
    selectedGenre === "all"
      ? movies
      : movies.filter((movie) => movie.genre.includes(selectedGenre));

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
<<<<<<< Updated upstream
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search movies..."
                className="w-full md:w-96 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
=======
        <div className="mb-10 space-y-4">
        <div className="flex flex-col space-y-4 md:flex md:flex-row md:space-y-0 md:space-x-4">
            <SearchBar />
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
>>>>>>> Stashed changes
              {["All", "Action", "Comedy", "Drama", "Sci-Fi"].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedGenre === genre.toLowerCase()
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading and Error Messages */}
        {isLoading && (
          <div className="text-center text-gray-300">Loading movies...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Page
          </button>
          <span className="px-4 py-2 text-sm font-medium text-white">
            Page {page}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}