import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, House, LogOut, PlusSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Layout({ children }) {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={20}/></span> gather<span className="brand-dot">.</span></div><nav><NavLink to="/"><House/> Home</NavLink><NavLink to="/explore"><Compass/> Explore</NavLink><NavLink to="/" onClick={() => window.dispatchEvent(new Event('open-composer'))}><PlusSquare/> Create post</NavLink><NavLink to={`/profile/${user.id}`}><span className="nav-avatar">{user.name?.[0]}</span> Profile</NavLink></nav><button className="logout" onClick={() => { logout(); navigate('/login'); }}><LogOut size={18}/> Log out</button><div className="sidebar-note">A little corner of the internet, just for you.</div></aside><main className="main-area"><header className="mobile-header"><div className="brand"><span className="brand-mark"><Sparkles size={18}/></span> gather.</div><button className="icon-btn" onClick={() => { logout(); navigate('/login'); }}><LogOut size={18}/></button></header>{children}</main></div>;
}
