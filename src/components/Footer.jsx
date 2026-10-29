function Footer() {
  return (
    <footer className="footer">
      <p>
        Movie data provided by{" "}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
      <p>
        Built by Mohamed ·{" "}
        <a
          href="https://github.com/hazard10oo/movie-explorer"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;
