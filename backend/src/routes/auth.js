import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router();
const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 8)
    return res.status(400).json({ message: 'Enter your name, a valid email, and a password of at least 8 characters.' });
  const normalized = email.trim().toLowerCase();
  if (await User.findOne({ email: normalized })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name: name.trim(), email: normalized, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: tokenFor(user.id), user: { id: user.id, name: user.name, email: user.email } });
}));
router.post('/login', asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
  if (!user || !await bcrypt.compare(req.body.password || '', user.password))
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: tokenFor(user.id), user: { id: user.id, name: user.name, email: user.email } });
}));
router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('name email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
}));
export default router;
