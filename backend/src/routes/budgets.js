import { Router } from 'express';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
const router=Router(); router.use(auth);
router.get('/:month',asyncHandler(async(req,res)=>{
 const item=await Budget.findOne({user:req.user.id,month:req.params.month}); res.json(item || {month:req.params.month,amount:0});
}));
router.put('/:month',asyncHandler(async(req,res)=>{
 const amount=Number(req.body.amount);
 if(!/^\d{4}-\d{2}$/.test(req.params.month)||!Number.isFinite(amount)||amount<0)
  return res.status(400).json({message:'Enter a valid month and non-negative budget.'});
 const item=await Budget.findOneAndUpdate({user:req.user.id,month:req.params.month},{amount},{upsert:true,new:true,runValidators:true});
 res.json(item);
}));
export default router;
