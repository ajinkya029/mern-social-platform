import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
function Protected({ children }) { const { user, loading } = useAuth(); if (loading) return <div className="center">Loading Gather…</div>; return user ? children : <Navigate to="/login" replace />; }
export default function App() {
  return <Routes><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage register />} /><Route path="/*" element={<Protected><Layout><Routes><Route path="/" element={<FeedPage />} /><Route path="/explore" element={<ExplorePage />} /><Route path="/profile/:id" element={<ProfilePage />} /></Routes></Layout></Protected>} /></Routes>;
}
