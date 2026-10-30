import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function PersonContent({ id }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=movie_credits`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load this person");
        return res.json();
      })
      .then((data) => {
        setPerson(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const movies = (person.movie_credits?.cast || [])
    .filter((m) => m.poster_path)
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);

  const bio = person.biography || "";
  const meta = [
    person.known_for_department,
    person.birthday,
    person.place_of_birth,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="person-page">
      <div className="person-header">
        {person.profile_path ? (
          <img
            className="person-photo"
            src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
            alt={person.name}
          />
        ) : (
          <div className="no-poster person-photo">No photo</div>
        )}

        <div className="person-info">
          <h1>{person.name}</h1>
          {meta && <p className="person-meta">{meta}</p>}

          <h2 className="section-title">Biography</h2>
          <p className={`person-bio ${expanded ? "" : "clamped"}`}>
            {bio || "No biography available."}
          </p>
          {bio.length > 400 && (
            <button className="link-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {movies.length > 0 && (
        <>
          <h2 className="section-title">Known for</h2>
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
        </>
      )}
    </div>
  );
}

function PersonPage() {
  const { id } = useParams();
  return <PersonContent key={id} id={id} />;
}

export default PersonPage;
