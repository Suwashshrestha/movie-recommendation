import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";

export function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  // Handle submit for search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();

    let url = "/search";

    // Add search query to the URL if it exists
    if (query) {
      url += `?search=${encodeURIComponent(query)}`;
    }

    // Add genre to the URL if it's selected (excluding "all")
    if (selectedGenre !== "all") {
      url += query ? `&genres=${encodeURIComponent(selectedGenre)}` : `?genres=${encodeURIComponent(selectedGenre)}`;
    }

    // Navigate to the constructed URL
    navigate(url);
  };

  // Handle submit for genre selection
  const handleGenreSubmit = (genre: string) => {
    const selected = genre.toLowerCase();
    setSelectedGenre(selected);

    let url = "/search";

    // Add genre to the URL if it's selected (excluding "all")
    if (selected !== "all") {
      url += `?genres=${encodeURIComponent(selected)}`;
    }

    // Add search query to the URL if it exists
    if (searchQuery.trim()) {
      url += selected !== "all" ? `&search=${encodeURIComponent(searchQuery.trim())}` : `?search=${encodeURIComponent(searchQuery.trim())}`;
    }

    // Navigate to the constructed URL
    navigate(url);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex md:flex-row md:space-y-0 md:space-x-4">
      {/* Search Input */}
      <Form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-sm text-purple-400 hover:text-purple-300"
        >
          Search
        </button>
      </Form>

      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-2">
        {["All", "Action", "Comedy", "Drama", "Sci-Fi"].map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreSubmit(genre)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                selectedGenre === genre.toLowerCase()
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white"
              } backdrop-blur-sm`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}