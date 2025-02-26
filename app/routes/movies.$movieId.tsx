import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getMovieById, type MovieSearch, getRecommendedMovies } from "~/utils/api";

interface LoaderData {
  movie: MovieSearch;
  recommendedMovies: MovieSearch[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const movieId = params.movieId;
  if (!movieId) throw new Response("Movie ID is required", { status: 400 });

  try {
    const movie = await getMovieById(movieId);
    
    // Get recommendations using movie_index
    let recommendedMovies: MovieSearch[] = [];
    if (movie.movie_index) {
      recommendedMovies = await getRecommendedMovies(movie.movie_index);
    }

    return json<LoaderData>({ 
      movie, 
      recommendedMovies 
    });
  } catch (error) {
    console.error("Error fetching movie data:", error);
    throw new Response("Failed to load movie details", { status: 500 });
  }
};

function RecommendedMovieCard({ movie }: { movie: MovieSearch }) {
  return (
    <Link to={`/movies/${movie.id}`} className="block group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        {movie.posterUri ? (
          <img
            src={movie.posterUri}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No poster</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
          {movie.avg_rating && (
            <div className="flex items-center mt-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="ml-1 text-xs text-gray-300">{movie.avg_rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function MovieDetails() {
  const { movie, recommendedMovies } = useLoaderData<LoaderData>();

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/discover"
          className="inline-flex items-center text-gray-300 hover:text-white mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Discover
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Poster and Ratings */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              {movie.posterUri ? (
                <img
                  src={movie.posterUri}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No poster available</span>
                </div>
              )}

              {/* Rating Section */}
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Rating</h3>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="ml-2 text-white">{movie.avg_rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Movie Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-xl text-gray-400 italic mb-6">{movie.tagline}</p>
            )}

            {/* Synopsis */}
            {movie.synopsis && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
              </div>
            )}

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {movie.cast.map((actor) => (
                    <span key={actor} className="text-gray-300">{actor}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {movie.director && (
                <div>
                  <h3 className="text-white font-semibold">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
              )}
              {movie.writers && (
                <div>
                  <h3 className="text-white font-semibold">Writers</h3>
                  <p className="text-gray-300">{movie.writers}</p>
                </div>
              )}
              {movie.producers && (
                <div>
                  <h3 className="text-white font-semibold">Producers</h3>
                  <p className="text-gray-300">{movie.producers}</p>
                </div>
              )}
              {movie.music_composer && (
                <div>
                  <h3 className="text-white font-semibold">Music</h3>
                  <p className="text-gray-300">{movie.music_composer}</p>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.production_companies && (
                  <div>
                    <h3 className="text-white font-semibold">Production Companies</h3>
                    <p className="text-gray-300">{movie.production_companies.join(", ")}</p>
                  </div>
                )}
                {movie.production_countries && (
                  <div>
                    <h3 className="text-white font-semibold">Production Countries</h3>
                    <p className="text-gray-300">{movie.production_countries.join(", ")}</p>
                  </div>
                )}
                {movie.spoken_languages && (
                  <div>
                    <h3 className="text-white font-semibold">Languages</h3>
                    <p className="text-gray-300">{movie.spoken_languages.join(", ")}</p>
                  </div>
                )}
                {movie.original_language && (
                  <div>
                    <h3 className="text-white font-semibold">Original Language</h3>
                    <p className="text-gray-300">{movie.original_language}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {recommendedMovies && recommendedMovies.length > 0 && (
          <div className="mt-16 border-t border-gray-800 pt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Recommended Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendedMovies.map((movie) => (
                <RecommendedMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}