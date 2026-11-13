import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router(); router.use(auth);
const valid = b => b.title?.trim() && Number(b.amount) > 0 && ['income','expense'].includes(b.type) && b.category?.trim() && b.date;
router.get('/', asyncHandler(async (req,res) => {
  const filter = { user: req.user.id };
  if (req.query.type && ['income','expense'].includes(req.query.type)) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.from || req.query.to) { filter.date = {}; if(req.query.from) filter.date.$gte = new Date(req.query.from); if(req.query.to) filter.date.$lte = new Date(req.query.to); }
  res.json(await Transaction.find(filter).sort({ date: -1, createdAt: -1 }));
}));
router.post('/', asyncHandler(async (req,res) => {
  if (!valid(req.body)) return res.status(400).json({ message: 'Complete all fields and enter an amount greater than zero.' });
  res.status(201).json(await Transaction.create({ ...req.body, amount: Number(req.body.amount), user: req.user.id }));
}));
router.get('/:id', asyncHandler(async (req,res) => {
  const item = await Transaction.findOne({ _id:req.params.id, user:req.user.id });
  if(!item) return res.status(404).json({message:'Transaction not found'}); res.json(item);
}));
router.put('/:id', asyncHandler(async (req,res) => {
  if (!valid(req.body)) return res.status(400).json({message:'Complete all fields and enter an amount greater than zero.'});
  const item = await Transaction.findOneAndUpdate({ _id:req.params.id, user:req.user.id }, { ...req.body, amount:Number(req.body.amount) }, {new:true, runValidators:true});
  if(!item) return res.status(404).json({message:'Transaction not found'}); res.json(item);
}));
router.delete('/:id', asyncHandler(async (req,res) => {
  const item = await Transaction.findOneAndDelete({ _id:req.params.id, user:req.user.id });
  if(!item) return res.status(404).json({message:'Transaction not found'}); res.json({message:'Transaction deleted'});
}));
export default router;
