import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import HeartIcon from "../components/HeartIcon";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const castRef = useRef(null);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`,
    )
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
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  function scrollCast(direction) {
    const row = castRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * 480, behavior: "smooth" });
  }
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
                  onClick={() => toggleFavorite(movie)}
                >
                  <HeartIcon
                    filled={favorites.some((f) => f.id === movie.id)}
                  />
                  {favorites.some((f) => f.id === movie.id)
                    ? "In favorites"
                    : "Add to favorites"}
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
            {cast.length > 0 && (
              <section className="cast">
                <h2 className="section-title">Top Cast</h2>

                <div className="cast-wrapper">
                  <button
                    className="cast-arrow left"
                    aria-label="Scroll left"
                    onClick={() => scrollCast(-1)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <div className="cast-row" ref={castRef}>
                    {cast.map((person) => (
                      <Link
                        key={person.credit_id}
                        to={`/person/${person.id}`}
                        className="cast-card"
                      >
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="cast-placeholder">
                            {person.name[0]}
                          </div>
                        )}
                        <p className="cast-name">{person.name}</p>
                        <p className="cast-character">{person.character}</p>
                      </Link>
                    ))}
                  </div>

                  <button
                    className="cast-arrow right"
                    aria-label="Scroll right"
                    onClick={() => scrollCast(1)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </section>
            )}
          </div>
        }
      </div>
    </div>
  );
}

export default MovieDetails;
