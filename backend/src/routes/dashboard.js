import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
const router=Router(); router.use(auth);
router.get('/',asyncHandler(async(req,res)=>{
 const month=/^\d{4}-\d{2}$/.test(req.query.month||'')?req.query.month:new Date().toISOString().slice(0,7);
 const start=new Date(`${month}-01T00:00:00.000Z`), end=new Date(start); end.setUTCMonth(end.getUTCMonth()+1);
 const [all,monthly,budget]=await Promise.all([
  Transaction.find({user:req.user.id}).sort({date:-1,createdAt:-1}).limit(6),
  Transaction.aggregate([{ $match:{user:(await import('mongoose')).default.Types.ObjectId.createFromHexString(req.user.id),date:{$gte:start,$lt:end}}},{ $group:{_id:'$type',total:{$sum:'$amount'}}}]),
  Budget.findOne({user:req.user.id,month})
 ]);
 const income=monthly.find(x=>x._id==='income')?.total||0, expenses=monthly.find(x=>x._id==='expense')?.total||0;
 const totals=await Transaction.aggregate([{ $match:{user:(await import('mongoose')).default.Types.ObjectId.createFromHexString(req.user.id)}},{ $group:{_id:'$type',total:{$sum:'$amount'}}}]);
 const totalIncome=totals.find(x=>x._id==='income')?.total||0, totalExpenses=totals.find(x=>x._id==='expense')?.total||0;
 res.json({month,balance:totalIncome-totalExpenses,totalIncome,totalExpenses,monthlyIncome:income,monthlyExpenses:expenses,budget:budget?.amount||0,recent:all});
}));
export default router;
