import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import GamesPage from './pages/GamesPage';
import ClickerGame from './pages/games/ClickerGame';
import ReflexGame from './pages/games/ReflexGame';
import MemoryGame from './pages/games/MemoryGame';
import PuzzleGame from './pages/games/PuzzleGame';
import TypingGame from './pages/games/TypingGame';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* The Outlet in Layout will render these child routes */}
        <Route index element={<HomePage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="games/clicker" element={<ClickerGame />} />
        <Route path="games/reflex" element={<ReflexGame />} />
        <Route path="games/memory" element={<MemoryGame />} />
        <Route path="games/puzzle" element={<PuzzleGame />} />
        <Route path="games/typing" element={<TypingGame />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
