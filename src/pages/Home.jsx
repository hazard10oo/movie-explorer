import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      let url;

      if (query === "") {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
      } else {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
      }

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load movies");
          return res.json();
        })
        .then((data) => {
          setMovies(data.results);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(movie) {
    const exist = favorites.some((f) => f.id === movie.id);

    if (exist) {
      setFavorites(favorites.filter((f) => f.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  }

  return (
    <>
      <h1>Movie Explorer</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && <p>No movies found</p>}
      {!loading && !error && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="no-poster">No poster</div>
                )}
                <h3>{movie.title}</h3>
              </Link>
              <button onClick={() => toggleFavorite(movie)}>
                {favorites.some((f) => f.id === movie.id) ? "❤️" : "🤍"}
              </button>
              <p>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
