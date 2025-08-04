import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import HomePage from '@pages/HomePage';
import AboutPage from '@pages/AboutPage';
import ContactPage from '@pages/ContactPage';
import DashboardPage from '@pages/DashboardPage';
import GamesPage from '@pages/GamesPage';
import ClickerGame from '@games/ClickerGame';
import ReflexGame from '@games/ReflexGame';
import ApiCall from '@utils/ApiCall';
import TypingGame from '@games/TypingGame';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* The Outlet in Layout will render these child routes */}
        <Route index element={<HomePage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="games/clicker" element={<ClickerGame />} />
        <Route path="games/reflex" element={<ReflexGame />} />
        
        <Route path="games/typing" element={<TypingGame />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
