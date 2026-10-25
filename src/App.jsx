import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
        console.log(data.results);
      });
  }, []);

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            srcset=""
          />
          <h3>{movie.title}</h3>
          <p>{movie.vote_average}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
