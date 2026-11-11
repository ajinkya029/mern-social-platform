import { Router } from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = Router();
const publicFields = 'name username bio avatar followers following createdAt';
router.use(auth);
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q ? { _id: { $ne: req.user._id }, $or: [{ name: new RegExp(q, 'i') }, { username: new RegExp(q, 'i') }] } : { _id: { $ne: req.user._id } };
    const users = await User.find(filter).select(publicFields).limit(30);
    res.json({ users });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(publicFields);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user, isFollowing: user.followers.some(id => id.equals(req.user._id)) });
  } catch (e) { next(e); }
});
router.put('/me', upload.single('avatar'), async (req, res, next) => {
  try {
    const updates = { name: req.body.name, bio: req.body.bio };
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ user: { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar, followers: user.followers, following: user.following } });
  } catch (e) { next(e); }
});
router.post('/:id/follow', async (req, res, next) => {
  try {
    if (req.params.id === String(req.user._id)) return res.status(400).json({ message: 'You cannot follow yourself' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const already = target.followers.some(id => id.equals(req.user._id));
    if (already) {
      await User.findByIdAndUpdate(target._id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: target._id } });
    } else {
      await User.findByIdAndUpdate(target._id, { $addToSet: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: target._id } });
    }
    const updated = await User.findById(target._id).select(publicFields);
    res.json({ isFollowing: !already, user: updated });
  } catch (e) { next(e); }
});
export default router;
