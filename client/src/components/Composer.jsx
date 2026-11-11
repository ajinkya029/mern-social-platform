import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import api from '../api';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';
export default function Composer({ onCreated }) {
  const { user } = useAuth(); const [text, setText] = useState(''); const [file, setFile] = useState(null); const [preview, setPreview] = useState(''); const [busy, setBusy] = useState(false); const input = useRef();
  useEffect(() => { const open = () => document.getElementById('post-text')?.focus(); window.addEventListener('open-composer', open); return () => window.removeEventListener('open-composer', open); }, []);
  function choose(e) { const f = e.target.files?.[0]; if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); }
  async function submit(e) { e.preventDefault(); if (!text.trim() && !file) return; const form = new FormData(); form.append('text', text); if (file) form.append('image', file); setBusy(true); try { const { data } = await api.post('/posts', form); onCreated(data.post); setText(''); setFile(null); setPreview(''); if (input.current) input.current.value = ''; } finally { setBusy(false); } }
  return <form className="composer" onSubmit={submit}><div className="composer-row"><Avatar user={user}/><textarea id="post-text" value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind today?" rows="2" maxLength="2000"/></div>{preview && <div className="preview-wrap"><img src={preview} alt="Preview"/><button type="button" className="remove-preview" onClick={() => {setFile(null);setPreview('');}}><X size={15}/></button></div>}<div className="composer-footer"><label className="attach-btn"><ImagePlus size={18}/> Photo<input ref={input} type="file" accept="image/*" onChange={choose} hidden/></label><button className="primary-btn" disabled={busy || (!text.trim() && !file)}>{busy ? 'Sharing…' : 'Share post'} <Send size={15}/></button></div></form>;
}
