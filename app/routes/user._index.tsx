import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { SlArrowRight } from "react-icons/sl";
import { getUserProfile, getMovieById, getUserRatings, fetchAndCacheWatchList } from "~/utils/api";
import type { MovieSearch, UserProfile, UserRating } from "~/utils/api";

export default function UserProfile() {
  const [movieDetails, setMovieDetails] = useState<MovieSearch[]>([]);
  const [watchList, setWatchList] = useState<{ movieIds: number; userFavoriteId: number }[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const profileData = await getUserProfile();
        setProfile(profileData);

        // Fetch user ratings
        const ratingsResponse = await getUserRatings();
        setRatings(ratingsResponse.results);

        // Fetch watchlist and movie details
        const movies = await fetchAndCacheWatchList();
        setWatchList(movies);

        const details = await Promise.all(
          movies.map(async (movie) => {
            const response = await getMovieById(String(movie.movieIds));
            return response;
          })
        );
        setMovieDetails(details);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
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
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const renderedRatings = [];
  for (let i = 0; i < 2 && i < ratings.length; i++) {
    const rating = ratings[i];
    renderedRatings.push(
      <div key={rating.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Link to={`/movies/${rating.movie.id}`}>
          <div className="bg-gray-700">
            <div className="inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="bottom-0 left-0 right-0 p-4">
              <h2 className="text-xl font-semibold text-white mb-2">{rating.movie.title}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg mr-1">★</span>
                  <span className="text-white">Your Rating: {rating.score}/10</span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(rating.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  const movieElements = [];

  // Loop through the first two items in movieDetails
  for (let i = 0; i < 2 && i < movieDetails.length; i++) {
    const movie = movieDetails[i];
    movieElements.push(
      <div key={watchList[i].userFavoriteId} className="relative">
        <Link
          to={`/movies/${movie.id}`}
          className="block bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
        >
          <div className="relative aspect-[2/3]">
            <img
              src={movie.posterUri || "https://via.placeholder.com/500x750"}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x750";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-300">{movie.year || "N/A"}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-300">{movie.avg_rating || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }



  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile?.username}</h1>
              <p className="text-gray-400">{profile?.email}</p>
              {profile?.is_verified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Verified Account
                </span>
              )}
            </div>
          </div>

          {/* Account Details and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-2">Account Details</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Username:</span>
                  <span className="ml-2 text-white">{profile?.username}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="ml-2 text-white">{profile?.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 text-white">
                    {profile?.is_verified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-2">Account Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-purple-400">{ratings.length}</span>
                  <span className="text-sm text-gray-400">Ratings</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-purple-400">{watchList.length}</span>
                  <span className="text-sm text-gray-400">Watchlist</span>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Ratings and Watchlist Sections */}
        <div className="grid grid-rows-1 md:grid-rows-3 gap-6 mt-8">
          {/* Ratings Section */}
          <div className=" h-fit p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              <Link to="/user/ratings" className="flex items-center gap-2">
                My Ratings
                <SlArrowRight className="hover:text-purple-400" />
              </Link>
            </h3>
            <p className="text-gray-400 text-sm">Rate movies to get personalized recommendations</p>
            <div className="grid grid-cols-1 gap-6">
              {renderedRatings}
              <Link to="/user/ratings" className="flex  items-end">
                See More ....
              </Link>
            </div>
          </div>

          {/* Watchlist Section */}
          <div className="group rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              <Link to="/user/watchlist" className="flex items-center gap-2">
                My Watchlist
                <SlArrowRight className="hover:text-purple-400" />
              </Link>
            </h3>
            <p className="text-gray-400 text-sm">Movies you want to watch later</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {movieElements}
              <Link to="/user/watchlist" className="flex  items-end">
                See More ....
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}