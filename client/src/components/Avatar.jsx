import { mediaUrl } from '../api';
export default function Avatar({ user, size = 'md' }) { return <div className={`avatar ${size}`}>{user?.avatar ? <img src={mediaUrl(user.avatar)} alt={user.name}/> : (user?.name || user?.username || '?').slice(0,1).toUpperCase()}</div>; }
