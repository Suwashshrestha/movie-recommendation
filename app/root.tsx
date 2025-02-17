import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  useNavigate
} from "@remix-run/react";
import { useState, useEffect } from "react";
import type { LinksFunction } from "@remix-run/node";
import { getUserProfile } from "~/utils/api";


import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/auth/login');
  };
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-950 text-white">
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
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? 'text-purple-500' : 'text-gray-300 hover:text-purple-400'
                      }`
                    }
                  >
                    Discover
                  </NavLink>
                  <NavLink 
                    to="/recommendations" 
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? 'text-purple-500' : 'text-gray-300 hover:text-purple-400'
                      }`
                    }
                  >
                    Recommendations
                  </NavLink>
                </div>
                <div className="flex items-center space-x-2">
                {isLoading ? (
                    <div className="text-gray-400">Loading...</div>
                  ) : isLoggedIn && userProfile ? (
                    <>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-white">
                          {userProfile.username}
                        </span>
                        
                      </div>
                      {userProfile.is_verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                      <button
                        onClick={handleLogout}
                        className="ml-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
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
        <main className="pt-16">
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
