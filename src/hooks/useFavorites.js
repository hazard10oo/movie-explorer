import { useState, useEffect } from "react";

function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  function toggleFavorite(movie) {
    const exist = favorites.some((f) => f.id === movie.id);

    if (exist) {
      setFavorites(favorites.filter((f) => f.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  }

  return { favorites, toggleFavorite };
}

export default useFavorites;
