import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { SearchBar } from "~/components/Searchbar";
import { searchMovies, type MovieSearch } from "~/utils/api";
import { Link } from "@remix-run/react";
interface LoaderData {
    movies: MovieSearch[];
    query: string;
    page: number;
    totalPages: number;
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = 12;

    if (!query) {
        return json<LoaderData>({
            movies: [],
            query: "",
            page: 1,
            totalPages: 0
        });
    }

    try {
        const data = await searchMovies(query, page, pageSize);
        return json<LoaderData>({
            movies: data.results as unknown as MovieSearch[],
            query,
            page,
            totalPages: Math.ceil(data.count / pageSize)
        });
    } catch (error) {
        console.error("Search error:", error);
        return json<LoaderData>({
            movies: [],
            query,
            page: 1,
            totalPages: 0
        });
    }
};

export default function Search() {
    const { movies, query } = useLoaderData<LoaderData>();

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {query ? `Search results for "${query}"` : "Search Movies"}
                    </h1>
                    <SearchBar />
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* No Results Message */}
                {query && movies.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        No movies found for &quot;{query}&quot;
                    </div>
                )}
            </div>
        </div>
    );
}

function MovieCard({ movie }: { movie: MovieSearch }) {
    return (
        <Link
            to={`/movies/${movie.id}`}
            className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
        >
            <div className="relative aspect-[2/3]">
                {movie.posterUri ? (
                    <img
                        src={movie.posterUri}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No poster available</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            {movie.avg_rating && (
                                <>
                                    <span className="text-yellow-400">★</span>
                                    <span className="ml-1 text-sm text-gray-300">
                                        {movie.avg_rating}
                                    </span>
                                </>
                            )}
                        </div>
                        {movie.genres && movie.genres.length > 0 && (
                            <span className="text-sm text-gray-300">
                                {movie.genres[0]}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
  
}