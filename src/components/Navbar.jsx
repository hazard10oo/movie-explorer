import { Link, NavLink } from "react-router-dom";
import SearchIcon from "./SearchIcon";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Movie<span>Explorer</span>
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        {/* الـ categories هتتضاف هنا في الخطوة 28 */}
      </nav>

      <button className="navbar-search-btn" aria-label="Search">
        <SearchIcon />
      </button>
    </header>
  );
}

export default Navbar;
