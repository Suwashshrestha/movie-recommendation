import { useState, useEffect } from "react";
import { fetchMovies } from "../utils/api";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  rating: number;
  year: string;
  genre: string[];
}

function MovieCard({ movie }: { movie: Movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // TODO: Add API call to update favorites
  };
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105">
      <div className="relative aspect-[2/3]">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
         <div className="absolute top-4 right-4 z-10">
          <button
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
          </button>
        </div>
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
    </div>
  );
}

export default function Discover() {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetchMovies(page, pageSize);
        console.log("Fetched Movies:", response);
        setMovies(response.results);
        
        setTotalPages(Math.ceil(response.count / pageSize));
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    loadMovies();
  }, [page]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
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
        <div className="mt-8 flex justify-center items-center gap-2">
      <button
        onClick={() => setPage(1)}
        disabled={page === 1 || isLoading}
        className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        First
      </button>
      {getPageNumbers().map((pageNum, index) => (
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={`page-${pageNum}`}
            onClick={() => setPage(Number(pageNum))}
            disabled={isLoading}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${page === pageNum 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
              }`}
          >
            {pageNum}
          </button>
        )
      ))}
      <button
        onClick={() => setPage(totalPages)}
        disabled={page === totalPages || isLoading}
        className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Last
      </button>
    </div>
      </div>
    </div>
  );
}