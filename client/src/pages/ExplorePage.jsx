import { useEffect, useState } from 'react';
import { Search, UserPlus, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
export default function ExplorePage() {
  const { user } = useAuth(); const [q,setQ] = useState(''); const [users,setUsers] = useState([]);
  useEffect(() => { const t = setTimeout(() => api.get('/users',{params:{q}}).then(r => setUsers(r.data.users)),250); return () => clearTimeout(t); },[q]);
  async function follow(id) { const {data} = await api.post(`/users/${id}/follow`); setUsers(list => list.map(u => u._id === id ? data.user : u)); }
  return <section className="explore-page"><div className="page-heading"><div><span className="eyebrow">MEET YOUR COMMUNITY</span><h1>Explore<span className="brand-dot">.</span></h1><p>Find interesting people and start a conversation.</p></div></div><div className="search-box"><Search size={19}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or username…"/></div><div className="people-grid">{users.map(u => { const following = u.followers?.some(id => String(id) === user.id); return <div className="person-card" key={u._id}><Avatar user={u} size="xl"/><h3>{u.name}</h3><span className="handle">@{u.username}</span><p>{u.bio || 'A new face in the Gather community.'}</p><div className="person-stats"><span><b>{u.followers?.length || 0}</b> followers</span><span><b>{u.following?.length || 0}</b> following</span></div><div className="person-actions"><Link to={`/profile/${u._id}`} className="outline-btn">View profile</Link><button className={following?'follow-btn following':'follow-btn'} onClick={() => follow(u._id)}>{following?<UserRoundCheck size={16}/>:<UserPlus size={16}/>} {following?'Following':'Follow'}</button></div></div>; })}</div>{!users.length && <div className="empty">No people found. Try another search.</div>}</section>;
}
