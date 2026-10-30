import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "./SearchIcon";
import HeartIcon from "./HeartIcon";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const FEATURED = ["Action", "Comedy", "Drama", "Horror"];

function Navbar() {
  const [genres, setGenres] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  function handleSearch(e) {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    navigate(`/?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setText("");
  }

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

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
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

        <div className="dropdown" ref={dropdownRef}>
          <button
            className="dropdown-btn"
            onClick={() => {
              setOpen(!open);
              setSearchOpen(false);
            }}
          >
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

      <div className="navbar-right">
        <NavLink
          to="/favorites"
          className="navbar-search-btn"
          aria-label="Favorites"
        >
          <HeartIcon />
        </NavLink>

        <div className="navbar-search" ref={searchRef}>
          {searchOpen && (
            <form onSubmit={handleSearch}>
              <input
                autoFocus
                type="text"
                placeholder="Search movies..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </form>
          )}
          <button
            className="navbar-search-btn"
            aria-label="Search"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setOpen(false);
            }}
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
