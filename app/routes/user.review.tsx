import { useState } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { updateUserPreferences } from "~/utils/api";

export default function UserReview() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const watchingFrequencies = [
    "DAILY", "WEEKLY", "OCCASIONALLY", "FEW TIMES A MONTH", "MONTHLY", "YEARLY"
  ];

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" },
    { label: "Prefer not to say", value: "P" }
  ];

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const age = formData.get("age");
    const gender = formData.get("gender");
    const watchingFrequency = formData.get("watchingFrequency");

    if (!age || !gender || !watchingFrequency || selectedGenres.length === 0) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    const ageNumber = parseInt(age as string, 10);
    if (isNaN(ageNumber) || ageNumber < 13 || ageNumber > 120) {
      setError("Please enter a valid age between 13 and 120");
      setIsLoading(false);
      return;
    }

    try {
      const userId = "current";
      const payload = {
        age: ageNumber,
        gender: gender as string,
        favoriteGenres: selectedGenres, // Fix: Send an array of strings
        watchFrequency: watchingFrequency as string,
       
      };
      
      console.log("Sending payload:", payload); // Debug log
      await updateUserPreferences(userId, payload);
      
      navigate("/user/movies");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update preferences. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
          <p className="mt-2 text-gray-400">Help us personalize your movie recommendations</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-200">Age</label>
            <input type="number" name="age" id="age" min="13" max="120" required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your age" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Gender</label>
            <div className="mt-2 space-y-2">
              {genderOptions.map(({ label, value }) => (
                <div key={value} className="flex items-center">
                  <input type="radio" name="gender" value={value} id={`gender-${value.toLowerCase()}`} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800" />
                  <label htmlFor={`gender-${value.toLowerCase()}`} className="ml-3 text-sm text-gray-300">{label}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Favorite Genres (Select up to 5)</label>
            <div className="grid grid-cols-2 gap-2">
              {genres.map((genre) => (
                <button key={genre} type="button" onClick={() => handleGenreToggle(genre)} disabled={selectedGenres.length >= 5 && !selectedGenres.includes(genre)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedGenres.includes(genre) ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} ${selectedGenres.length >= 5 && !selectedGenres.includes(genre) ? 'opacity-50 cursor-not-allowed' : ''}`}>{genre}</button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="watchingFrequency" className="block text-sm font-medium text-gray-200">How often do you watch movies?</label>
            <select name="watchingFrequency" id="watchingFrequency" required className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Select frequency</option>
              {watchingFrequencies.map((frequency) => (
                <option key={frequency} value={frequency}>{frequency.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={isLoading || selectedGenres.length === 0} className="w-full px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Loading..." : "Continue"}</button>
        </Form>
      </div>
    </div>
  );
}
