import { useState, useEffect } from "react";
import { getUserProfile } from "~/utils/api";
import { Link } from "@remix-run/react";
import { SlArrowRight } from "react-icons/sl";


interface UserProfile {
  email: string;
  username: string;
  is_verified: boolean;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screenitems-center justify-center ">
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

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-72 mt-8">
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
                  <span className="block text-2xl font-bold text-purple-400">0</span>
                  <span className="text-sm text-gray-400">Ratings</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-purple-400">0</span>
                  <span className="text-sm text-gray-400">Watchlist</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Edit Profile
            </button>
          </div>


        </div>


        <div className="grid grid-rows-1 md:grid-rows-3 gap-6 mt-8">
          <div className="group rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              <Link to="/user/lists" className="flex items-center gap-2">
                My Lists
                <div className="hover:text-purple-400">
                  <SlArrowRight />
                </div>
              </Link>
            </h3>
            <p className="text-gray-400 text-sm">Create and manage your movie collections</p>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-2xl font-semibold text-gray-500 mb-2">No Lists Yet</p>
              <p className="text-gray-400 text-sm">Create and manage your movie collections</p>
            </div>
          </div>

          <div className="group rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              <Link to="/user/ratings" className="flex items-center gap-2">
                My Ratings
                <div className="hover:text-purple-400">
                  <SlArrowRight />
                </div>
              </Link>
            </h3>
            <p className="text-gray-400 text-sm">Rate movies to get personalized recommendations</p>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-2xl font-semibold text-gray-500 mb-2">No Ratings Yet</p>
              <p className="text-gray-400 text-sm">Rate movies to get personalized recommendations</p>
            </div>
          </div>

          <div className="group rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              <Link to="/user/watchlist" className="flex items-center gap-2">
                My Watchlist
                <div className="hover:text-purple-400">
                  <SlArrowRight />
                </div>
              </Link>
            </h3>
            <p className="text-gray-400 text-sm">Movies you want to watch later</p>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-2xl font-semibold text-gray-500 mb-2">No Movies Added</p>
              <p className="text-gray-400 text-sm">Add movies you want to watch later</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}