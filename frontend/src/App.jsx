import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Placeholder pages
const HomePage = () => <div>Home Page Content</div>;
const GamesPage = () => <div>Games Page Content</div>;
const AboutPage = () => <div>About Page Content</div>;
const ContactPage = () => <div>Contact Page Content</div>;
const DashboardPage = () => <div>Dashboard Page Content</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* The Outlet in Layout will render these child routes */}
        <Route index element={<HomePage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* The route for a specific game, e.g., /games/clicker, will be added later */}
      </Route>
    </Routes>
  );
}

export default App;
