import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

function MovieCard({ movie, isFavorite, onToggle }) {
  return (
    <div className="movie-card">
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
        className={`fav-btn-card ${isFavorite ? "active" : ""}`}
        aria-label="Toggle favorite"
        onClick={() => onToggle(movie)}
      >
        <HeartIcon filled={isFavorite} />
      </button>
    </div>
  );
}

export default MovieCard;
