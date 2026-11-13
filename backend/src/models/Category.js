import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 40 },
  color: { type: String, default: '#6C63FF' }
}, { timestamps: true });
schema.index({ user: 1, name: 1 }, { unique: true });
export default mongoose.model('Category', schema);
