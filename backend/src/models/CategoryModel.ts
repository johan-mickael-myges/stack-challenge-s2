import mongoose, { Schema } from 'mongoose';
import { Category } from '../interfaces';

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false }
});

export default mongoose.model<Category>('categories', CategorySchema);
