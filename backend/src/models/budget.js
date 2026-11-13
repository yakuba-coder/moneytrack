import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true });
schema.index({ user: 1, month: 1 }, { unique: true });
export default mongoose.model('Budget', schema);
