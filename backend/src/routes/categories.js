import { Router } from 'express';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
const router=Router(); router.use(auth);
router.get('/', asyncHandler(async(req,res)=>res.json(await Category.find({user:req.user.id}).sort({name:1}))));
router.post('/', asyncHandler(async(req,res)=>{
 const name=req.body.name?.trim(); if(!name) return res.status(400).json({message:'Category name is required'});
 res.status(201).json(await Category.create({user:req.user.id,name,color:req.body.color}));
}));
router.put('/:id', asyncHandler(async(req,res)=>{
 const item=await Category.findOneAndUpdate({_id:req.params.id,user:req.user.id},{name:req.body.name?.trim(),color:req.body.color},{new:true,runValidators:true});
 if(!item)return res.status(404).json({message:'Category not found'}); res.json(item);
}));
router.delete('/:id', asyncHandler(async(req,res)=>{
 const item=await Category.findOneAndDelete({_id:req.params.id,user:req.user.id});
 if(!item)return res.status(404).json({message:'Category not found'}); res.json({message:'Category deleted'});
}));
export default router;
