import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="genre-page">
      <h1 className="page-title">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any favorites yet.</p>
          <Link to="/" className="hero-btn">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              onToggle={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
