import { useState, useEffect } from "react";



import { fetchMovies, trackMovieInteraction } from "../utils/api";

import { SearchBar } from "~/components/Searchbar";
import { Link } from "@remix-run/react";
import { FavoriteIcon } from "../components/Favorite"
import { WatchlistIcon } from "../components/Watchlist"



interface Movie {
  id: string;
  title: string;
  posterUri?: string;
  rating?: string;
  year?: string;
  genre?: string[];
}

export function MovieCard({ movie }: { movie: Movie }) {

  const [loading, setLoading] = useState(false);


  const handleInteractionView = async (e) => {
    // e.preventDefault();
    if (!e.defaultPrevented)
      setLoading(true);
    try {
      await trackMovieInteraction(movie.id, 'VIEW');
    } catch (error) {
      console.error('Failed to track view interaction:', error);
      // Silently fail as this shouldn't block user navigation
    }
  };
  const handleInteractionFavorite = async () => {
    try {
      await trackMovieInteraction(movie.id, 'FAVORITE');
    } catch (error) {
      console.error('Failed ', error);
    }
  };
  const handleInteractionWatchlist = async () => {
    try {
      await trackMovieInteraction(movie.id, 'WATCHLIST');
    } catch (error) {
      console.error('Failed ', error);
    }
  };



  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center ">
          <img
            src="/loading.gif"
            alt="Loading..."
            className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
          />
        </div>
      ) : (
        <Link
          to={`/movies/${movie.id}`}
          onClick={handleInteractionView}

          className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
        >
          <div className="relative aspect-[2/3]">
            <img
              src={movie.posterUri || '/movie_poster.jpeg'}
              alt={movie.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => {
                  handleInteractionFavorite();

                }}
                className="cursor-pointer focus:outline-none"
                aria-label="Add to favorites"
              >
                <FavoriteIcon movieId={Number(movie.id)} />
              </button>
            </div>
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={handleInteractionWatchlist}
                className="cursor-pointer focus:outline-none"
                aria-label="Add to watchlist"
              >
                <WatchlistIcon movieId={Number(movie.id)} />
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
        </Link>
      )}

    </>
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



        <div className="mb-10 space-y-4">
          <div className="flex flex-col space-y-4 md:flex md:flex-row md:space-y-0 md:space-x-4">
            <SearchBar />
            {/* Genre Filter */}

          </div>
        </div>

        <div className="mb-6 md:hidden">
          <div className="flex justify-center items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || isLoading}
              className="px-2 py-1.5 text-xs font-medium text-white bg-purple-600 
               rounded-md hover:bg-purple-700 disabled:opacity-50 
               disabled:cursor-not-allowed transition-colors"
            >
              First
            </button>
            {getPageNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setPage(Number(pageNum))}
                  disabled={isLoading}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors
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
              className="px-2 py-1.5 text-xs font-medium text-white bg-purple-600 
               rounded-md hover:bg-purple-700 disabled:opacity-50 
               disabled:cursor-not-allowed transition-colors"
            >
              Last
            </button>
          </div>
        </div>

        {/* Loading and Error Messages */}
        {isLoading && (
          <div className="flex items-center justify-center ">
            <img
              src="/loading.gif"
              alt="Loading..."
              className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
            />
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="hidden md:flex mt-8 justify-center items-center gap-2">
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