import { useState, useEffect } from "react";
import { fetchMovies } from "../utils/api"
interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: string;
  genre: string[];
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105">
      <div className="relative aspect-[2/3]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
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

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const data = await fetchMovies();
        console.log("Fetched Movies:", data); 
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    loadMovies();
  }, []);
  

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
      </div>
    </div>
  );
}

