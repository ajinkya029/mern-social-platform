import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../api';
import Composer from '../components/Composer';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
export default function FeedPage() {
  const { user } = useAuth(); const [posts,setPosts] = useState([]); const [loading,setLoading] = useState(true);
  useEffect(() => { api.get('/posts').then(r => setPosts(r.data.posts)).finally(() => setLoading(false)); }, []);
  function update(post) { setPosts(p => p.map(x => x._id === post._id ? post : x)); }
  async function remove(id) { if (!confirm('Delete this post? This cannot be undone.')) return; await api.delete(`/posts/${id}`); setPosts(p => p.filter(x => x._id !== id)); }
  return <div className="content-grid"><section className="feed-column"><div className="page-heading"><div><span className="eyebrow">YOUR COMMUNITY</span><h1>Your feed<span className="brand-dot">.</span></h1><p>The latest from people you follow and everyone around you.</p></div><span className="heading-spark"><Sparkles/></span></div><Composer onCreated={post => setPosts(p => [post,...p])}/><div className="feed-label"><span>RECENT STORIES</span><span>{posts.length} posts</span></div>{loading ? <div className="empty">Loading your feed…</div> : posts.length ? posts.map(p => <PostCard key={p._id} post={p} onUpdate={update} onDelete={remove}/>) : <div className="empty"><div className="empty-icon">✳</div><h3>Your feed starts here.</h3><p>Share a thought or explore the community to find your people.</p><Link className="text-link" to="/explore">Discover people →</Link></div>}</section><aside className="right-rail"><div className="welcome-card"><span className="eyebrow">YOUR SPACE</span><Avatar user={user} size="xl"/><h3>Hey, {user.name?.split(' ')[0]}!</h3><p>Good things happen when we share them. Make yourself at home.</p><Link to={`/profile/${user.id}`} className="outline-btn">View your profile</Link></div><div className="tip-card"><span className="eyebrow">A LITTLE REMINDER</span><p>“Connection is why we're here; it is what gives purpose and meaning to our lives.”</p><small>— Brené Brown</small></div><div className="rail-footer">Gather · Make room for connection.</div></aside></div>;
}
