import { useEffect, useState } from 'react';
import { getMovieById, type MovieSearch } from "~/utils/api";
import { fetchAndCacheWatchList } from '../utils/api';

const WatchListPage = () => {
  const [watchList, setWatchList] = useState<{ movieIds: number; userFavoriteId: number }[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        const movies = await fetchAndCacheWatchList();
        setWatchList(movies);
        await fetchMovieDetails(movies);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch watchlist');
        setLoading(false);
      }
    };

    const fetchMovieDetails = async (movies: { movieIds: number; userFavoriteId: number }[]) => {
      try {
        const details = await Promise.all(
          movies.map(async (movie) => {
            const response = await getMovieById(String(movie.movieIds));
            console.log("response from getMovieById", response);
            return response;
          })
        );
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchWatchList();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>My Watchlist</h1>
      <ul>
        {movieDetails.map((movie, index) => (
          <li key={watchList[index].userFavoriteId}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WatchListPage;