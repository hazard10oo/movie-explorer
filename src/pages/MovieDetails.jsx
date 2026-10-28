import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load movie details");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="details-page">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <p>{error}</p>
      </div>
    );
  }

  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const meta = [year, runtime].filter(Boolean).join(" • ");
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  return (
    <div
      className="details-backdrop"
      style={
        backdropUrl
          ? {
              backgroundImage: `linear-gradient(rgba(20,20,20,0.85), #141414), url(${backdropUrl})`,
            }
          : undefined
      }
    >
      <div className="details-page">
        {
          <div className="details-page">
            <Link to="/" className="back-link">
              ← Back
            </Link>

            <div className="details">
              {movie.poster_path ? (
                <img
                  className="details-poster"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster details-poster">No poster</div>
              )}

              <div className="details-info">
                <h1>{movie.title}</h1>
                {movie.tagline && <p className="tagline">{movie.tagline}</p>}
                {meta && <p>{meta}</p>}
                <p>
                  ⭐{" "}
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </p>

                <button
                  className="fav-btn"
                  aria-label="Toggle favorite"
                  onClick={() => toggleFavorite(movie)}
                >
                  {favorites.some((f) => f.id === movie.id) ? "❤️" : "🤍"}
                </button>

                <div className="genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </div>

                <h3>Overview</h3>
                <p>{movie.overview || "No overview available."}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default MovieDetails;
