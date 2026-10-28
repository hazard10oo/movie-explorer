import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
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
          <p>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>

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
  );
}

export default MovieDetails;
