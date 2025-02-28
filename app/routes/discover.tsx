import { useState, useEffect } from "react";
import { fetchMovies, trackMovieInteraction, searchMovies, type MovieSearch } from "../utils/api";

import { Link, useNavigate,Form } from "@remix-run/react";
import { FavoriteIcon } from "../components/Favorite";
import { WatchlistIcon } from "../components/Watchlist";




function MovieCard({ movie }: { movie: MovieSearch }) {
  const handleInteractionView = async () => {
    try {
      await trackMovieInteraction(movie.id, 'VIEW');
    } catch (error) {
      console.error('Failed to track view interaction:', error);
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
    <Link
      to={`/movies/${movie.id}`}
      onClick={handleInteractionView}
      className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
    >
      <div className="relative aspect-[2/3]">
        <img
          src={movie.posterUri}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleInteractionFavorite}
            className="cursor-pointer focus:outline-none"
            aria-label="Add to favorites"
          >
            <FavoriteIcon movieId = {Number(movie.id)} />
          </button>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleInteractionWatchlist}
            className="cursor-pointer focus:outline-none"
            aria-label="Add to watchlist"
          >
            <WatchlistIcon movieId={Number(movie.id)}/>
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-300">{movie.year}</span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-300">{movie.avg_rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Discover() {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [movies, setMovies] = useState<MovieSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;
  const [searchQuery, setSearchQuery] = useState<string>("");


  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = searchQuery.trim()
          ? await searchMovies(searchQuery, page, pageSize)
          : await fetchMovies(page, pageSize);
  
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
  }, [page, searchQuery]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      if (startPage > 2) {
        pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // const filteredMovies =
  //   selectedGenre === "all"
  //     ? movies
  //     : movies.filter((movie) => movie.genres.includes(selectedGenre));

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-4">
          <div className="flex flex-col space-y-4 md:flex md:flex-row md:space-y-0 md:space-x-4">
          <Form onSubmit={handleSubmit} className="relative w-full md:w-96">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search movies..."
        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-sm text-purple-400 hover:text-purple-300"
      >
        Search
      </button>
    </Form>
            <div className="flex flex-wrap gap-2">
              {["All", "Action", "Comedy", "Drama", "Sci-Fi"].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre.toLowerCase())}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${selectedGenre === genre.toLowerCase()
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white"
                    } backdrop-blur-sm`}
                >
                  {genre}
                </button>
              ))}
            </div>
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

        {isLoading && (
          <div className="flex flex-col items-center justify-center bg-gray-900">
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
                <circle cx="137" cy="216" r="20" fill="#FF6B6B" className="animate-ping" />
                <circle cx="236" cy="216" r="20" fill="#FF6B6B" className="animate-ping [animation-delay:150ms]" />
                <circle cx="335" cy="216" r="20" fill="#FF6B6B" className="animate-ping [animation-delay:300ms]" />
              </svg>

              <h1 className="mt-8 text-4xl font-bold text-white">
                Loading Movies...
              </h1>
              <p className="mt-4 text-lg text-gray-400">
                Grab your popcorn! 🍿
                <br />
                Discovering Movies...
              </p>

              <div className="mt-8 flex justify-center space-x-2">
                <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:0ms]"></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]"></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]"></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

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