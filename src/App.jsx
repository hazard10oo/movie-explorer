import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
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
  }, [query]);

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
      {!loading && !error && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster">No poster</div>
              )}
              <h3>{movie.title}</h3>
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

export default App;
