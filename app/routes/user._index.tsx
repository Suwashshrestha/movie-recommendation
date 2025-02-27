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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
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
            <circle cx="137" cy="216" r="20" fill="#FF6B6B" className="animate-ping"/>
            <circle cx="236" cy="216" r="20" fill="#FF6B6B" className="animate-ping [animation-delay:150ms]"/>
            <circle cx="335" cy="216" r="20" fill="#FF6B6B" className="animate-ping [animation-delay:300ms]"/>
          </svg>
          
          <h1 className="mt-8 text-4xl font-bold text-white">
            Loading Profile...
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Grab your popcorn! 🍿
            <br />
            We're getting your profile ready.
          </p>
          
          <div className="mt-8 flex justify-center space-x-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:0ms]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]"></div>
          </div>
        </div>
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