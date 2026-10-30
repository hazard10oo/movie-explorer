import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import GenrePage from "./pages/GenrePage";
import Footer from "./components/Footer";
import Favorites from "./pages/Favorites";
import PersonPage from "./pages/PersonPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/person/:id" element={<PersonPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
