import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchIcon from "./SearchIcon";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const FEATURED = ["Action", "Comedy", "Drama", "Horror"];

function Navbar() {
  const [genres, setGenres] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load genres");
        return res.json();
      })
      .then((data) => {
        setGenres(data.genres);
      })
      .catch(() => {
        setGenres([]);
      });
  }, []);

  const featured = FEATURED.map((name) =>
    genres.find((g) => g.name === name),
  ).filter(Boolean);

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Movie<span>Explorer</span>
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end>
          Home
        </NavLink>

        {featured.map((genre) => (
          <NavLink
            key={genre.id}
            to={`/genre/${genre.id}`}
            className="genre-link"
          >
            {genre.name}
          </NavLink>
        ))}

        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setOpen(!open)}>
            More ▾
          </button>

          {open && (
            <div className="dropdown-menu">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className={
                    FEATURED.includes(genre.name) ? "featured-in-menu" : ""
                  }
                  onClick={() => setOpen(false)}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <button className="navbar-search-btn" aria-label="Search">
        <SearchIcon />
      </button>
    </header>
  );
}

export default Navbar;
