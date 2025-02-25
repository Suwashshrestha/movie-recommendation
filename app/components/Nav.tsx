import { NavLink, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { getUserProfile } from "~/utils/api";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Nav() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              CineMatch
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'text-purple-400 bg-purple-500/10' 
                  : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800'}`
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'text-purple-400 bg-purple-500/10' 
                  : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800'}`
              }
            >
              Recommendations
            </NavLink>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && userProfile ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-md 
                           hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-white group-hover:text-purple-400">
                      {userProfile.username}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 
                              ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800/95 rounded-lg 
                                shadow-xl z-50 border border-gray-700 backdrop-blur-sm">
                    <NavLink
                      to="/user"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 
                               hover:text-purple-400 transition-colors"
                    >
                      Your Profile
                    </NavLink>
                    <NavLink
                      to="/user/watchlist"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 
                               hover:text-purple-400 transition-colors"
                    >
                      Your Watchlist
                    </NavLink>
                    <NavLink
                      to="/user/ratings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 
                               hover:text-purple-400 transition-colors"
                    >
                      Your Ratings
                    </NavLink>
                    <NavLink
                      to="/user/lists"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 
                               hover:text-purple-400 transition-colors"
                    >
                      Your Lists
                    </NavLink>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 
                               hover:bg-gray-700/50 hover:text-red-300 transition-colors"
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
                  className="text-gray-300 hover:text-purple-400 text-sm font-medium transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 
                           rounded-md hover:bg-purple-700 transition-colors
                           shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 
                       transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-gray-300 hover:text-purple-400'}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Discover
            </NavLink>
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-gray-300 hover:text-purple-400'}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recommendations
            </NavLink>
            
            {isLoggedIn && userProfile && (
              <>
                <NavLink
                  to="/user"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 
                           hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Profile
                </NavLink>
                <NavLink
                  to="/user/watchlist"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 
                           hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Watchlist
                </NavLink>
                <NavLink
                  to="/user/ratings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 
                           hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Ratings
                </NavLink>
                <NavLink
                  to="/user/lists"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 
                           hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Lists
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 
                           hover:text-red-300 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
          
          {/* Mobile Auth Buttons */}
          {!isLoggedIn && (
            <div className="px-5 py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-3">
                <NavLink
                  to="/auth/login"
                  className="text-gray-300 hover:text-purple-400 text-center py-2 
                           transition-colors text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="w-full px-4 py-2 text-base font-medium text-white bg-purple-600 
                           rounded-md hover:bg-purple-700 transition-colors text-center
                           shadow-lg shadow-purple-500/25"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}