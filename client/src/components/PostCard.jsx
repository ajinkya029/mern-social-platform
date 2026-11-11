import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Send, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { mediaUrl } from '../api';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';
export default function PostCard({ post, onUpdate, onDelete }) {
  const { user } = useAuth(); const [comment, setComment] = useState(''); const [showComments, setShowComments] = useState(false); const [busy, setBusy] = useState(false);
  const liked = post.likes?.some(id => String(id) === String(user.id) || String(id?._id) === String(user.id));
  const date = new Date(post.createdAt).toLocaleDateString(undefined, { month:'short', day:'numeric' });
  async function toggleLike() { const { data } = await api.post(`/posts/${post._id}/like`); onUpdate({ ...post, likes: data.liked ? [...post.likes, user.id] : post.likes.filter(id => String(id?._id || id) !== user.id) }); }
  async function addComment(e) { e.preventDefault(); if (!comment.trim()) return; setBusy(true); try { const { data } = await api.post(`/posts/${post._id}/comments`, { text: comment }); onUpdate(data.post); setComment(''); setShowComments(true); } finally { setBusy(false); } }
  async function deleteComment(id) { const { data } = await api.delete(`/posts/${post._id}/comments/${id}`); onUpdate(data.post); }
  return <article className="post-card"><div className="post-top"><Link to={`/profile/${post.author?._id}`} className="author"><Avatar user={post.author}/><span><b>{post.author?.name}</b><small>@{post.author?.username} · {date}</small></span></Link>{post.author?._id === user.id && <button className="icon-btn subtle" title="Delete post" onClick={() => onDelete(post._id)}><MoreHorizontal size={20}/></button>}</div>{post.text && <p className="post-text">{post.text}</p>}{post.image && <img className="post-image" src={mediaUrl(post.image)} alt="Post attachment"/>}<div className="post-actions"><button className={liked ? 'action liked' : 'action'} onClick={toggleLike}><Heart size={19} fill={liked ? 'currentColor' : 'none'}/><span>{post.likes?.length || 0}</span></button><button className="action" onClick={() => setShowComments(v => !v)}><MessageCircle size={19}/><span>{post.comments?.length || 0}</span></button></div>{showComments && <div className="comments"><form onSubmit={addComment} className="comment-form"><input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a thoughtful comment…"/><button disabled={busy || !comment.trim()}><Send size={16}/></button></form>{post.comments?.map(c => <div className="comment" key={c._id}><Avatar user={c.author} size="sm"/><div className="comment-body"><b>{c.author?.name}</b><span>{c.text}</span></div>{c.author?._id === user.id && <button className="icon-btn" onClick={() => deleteComment(c._id)}><Trash2 size={14}/></button>}</div>)}</div>}</article>;
}
