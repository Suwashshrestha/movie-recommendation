import {
    NavLink,
    useNavigate
  } from "@remix-run/react";
  import { useState, useEffect, useRef } from "react";
  
  import { getUserProfile } from "~/utils/api";

  export function Nav(){
    const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        console.log("@@")
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        console.log("updated")
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to load profile:', error);
        localStorage.removeItem('auth_token');
        navigate('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  console.log({ isLoggedIn, userProfile })

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/');
  };
  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <NavLink to="/" className="text-2xl font-bold text-purple-500">
            CineMatch
          </NavLink>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-4">
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-500' : 'text-gray-300 hover:text-purple-400'
                }`
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-purple-500' : 'text-gray-300 hover:text-purple-400'
                }`
              }
            >
              Recommendations
            </NavLink>
          </div>
          <div className="flex items-center space-x-2">
            {isLoggedIn && userProfile ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-white">
                      {userProfile.username}
                    </span>
                    {/* {userProfile.is_verified && (
                      <span className="text-xs text-purple-400">Verified</span>
                    )} */}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-md shadow-xl z-50">
                    <NavLink
                      to="/user"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Your Profile
                    </NavLink>
                    <NavLink
                      to="/user/watchlist"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Your Watchlist
                    </NavLink>
                    <NavLink
                      to="/user/ratings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Your Ratings
                    </NavLink>
                    <NavLink
                      to="/user/lists"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Your Lists
                    </NavLink>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/auth/login"
                  className="text-gray-300 hover:text-purple-400"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </nav>
  )
}

