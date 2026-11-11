import { Router } from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = Router();
router.use(auth);
const populate = query => query.populate('author', 'name username avatar').populate('comments.author', 'name username avatar');
router.get('/', async (_req, res, next) => {
  try { res.json({ posts: await populate(Post.find().sort({ createdAt: -1 }).limit(100)) }); }
  catch (e) { next(e); }
});
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text && !req.file) return res.status(400).json({ message: 'Write something or attach an image' });
    const post = await Post.create({ author: req.user._id, text, image: req.file ? `/uploads/${req.file.filename}` : '' });
    res.status(201).json({ post: await populate(Post.findById(post._id)) });
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ message: 'Not your post' });
    post.text = (req.body.text || '').trim();
    await post.save();
    res.json({ post: await populate(Post.findById(post._id)) });
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ message: 'Not your post' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (e) { next(e); }
});
router.post('/:id/like', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const liked = post.likes.some(id => id.equals(req.user._id));
    if (liked) post.likes.pull(req.user._id); else post.likes.addToSet(req.user._id);
    await post.save();
    res.json({ liked: !liked, likes: post.likes.length });
  } catch (e) { next(e); }
});
router.post('/:id/comments', async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ author: req.user._id, text });
    await post.save();
    res.json({ post: await populate(Post.findById(post._id)) });
  } catch (e) { next(e); }
});
router.delete('/:id/comments/:commentId', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (!comment.author.equals(req.user._id)) return res.status(403).json({ message: 'Not your comment' });
    comment.deleteOne();
    await post.save();
    res.json({ post: await populate(Post.findById(post._id)) });
  } catch (e) { next(e); }
});
export default router;
