import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import HeartIcon from "../components/HeartIcon";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const { favorites, toggleFavorite } = useFavorites();

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

  const heroMovies =
    query === "" ? movies.filter((m) => m.backdrop_path).slice(0, 5) : [];
  const heroCount = heroMovies.length;
  const activeIndex = heroCount ? heroIndex % heroCount : 0;

  useEffect(() => {
    if (heroCount < 2) return;

    const timer = setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % heroCount);
    }, 6000);

    return () => clearTimeout(timer);
  }, [heroIndex, heroCount]);

  return (
    <>
      {!loading && !error && heroCount > 0 && (
        <section className="hero">
          {heroMovies.map((m, i) => (
            <div
              key={m.id}
              className={`hero-slide ${i === activeIndex ? "active" : ""}`}
              style={{
                backgroundImage: `linear-gradient(90deg, #141414 0%, rgba(20,20,20,0.2) 65%), linear-gradient(0deg, #141414 0%, transparent 35%), url(https://image.tmdb.org/t/p/w1280${m.backdrop_path})`,
              }}
            >
              <div className="hero-content">
                <span className="hero-label">Trending now</span>
                <h2>{m.title}</h2>
                <p>{m.overview}</p>
                <Link to={`/movie/${m.id}`} className="hero-btn">
                  View details
                </Link>
              </div>
            </div>
          ))}

          <div className="hero-dots">
            {heroMovies.map((m, i) => (
              <button
                key={m.id}
                className={i === activeIndex ? "active" : ""}
                aria-label={`Show ${m.title}`}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
        </section>
      )}

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
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-poster">No poster</div>
                )}
                <div className="card-overlay">
                  <h3>{movie.title}</h3>
                </div>
              </Link>

              <span className="rating-badge">
                <span className="star">★</span>{" "}
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>

              <button
                className={`fav-btn-card ${
                  favorites.some((f) => f.id === movie.id) ? "active" : ""
                }`}
                aria-label="Toggle favorite"
                onClick={() => toggleFavorite(movie)}
              >
                <HeartIcon filled={favorites.some((f) => f.id === movie.id)} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
