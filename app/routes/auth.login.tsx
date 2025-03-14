import { useState, useEffect } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { loginUser } from "~/utils/api";
import { setLoggedIn } from "~/global";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        console.log("Login successful, redirecting...");
        navigate("/user/review");
      }
      setLoggedIn(true);
    }
  }, [loginSuccess, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    setLoginSuccess(false);

    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await loginUser(credentials);
      localStorage.setItem("auth_token", response.auth_token);
     
      setLoginSuccess(true);
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Invalid credentials");
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-gray-900/90 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Cinema Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-md w-full">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-400">
                Sign in to continue your movie journey
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-900/50 p-4 text-red-200 border border-red-500">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <a
                  href="/auth/reset-password"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </Form>

            <p className="mt-6 text-center text-gray-400">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}