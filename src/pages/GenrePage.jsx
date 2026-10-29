import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function GenreMovies({ id }) {
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}&sort_by=popularity.desc`;
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

    Promise.all([fetch(moviesUrl), fetch(genresUrl)])
      .then(([moviesRes, genresRes]) => {
        if (!moviesRes.ok || !genresRes.ok) {
          throw new Error("Failed to load movies");
        }
        return Promise.all([moviesRes.json(), genresRes.json()]);
      })
      .then(([moviesData, genresData]) => {
        setMovies(moviesData.results);
        const genre = genresData.genres.find((g) => g.id === Number(id));
        setGenreName(genre ? genre.name : "");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="genre-page">
      <h1 className="page-title">{genreName || "Movies"}</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && <p>No movies found</p>}
      {!loading && !error && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some((f) => f.id === movie.id)}
              onToggle={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GenrePage() {
  const { id } = useParams();
  return <GenreMovies key={id} id={id} />;
}

export default GenrePage;
