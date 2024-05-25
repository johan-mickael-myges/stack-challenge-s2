import mongoose, { Schema } from 'mongoose';
import { Product } from '../interfaces';

const DescriptionSchema: Schema = new Schema({
    weight: { type: Number, required: false, max: 999 },
    height: { type: Number, required: false, max: 999 },
    width: { type: Number, required: false, max: 999 },
    depth: { type: Number, required: false, max: 999 },
    text: { type: String, required: false },
});

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    price: { type: Number, required: true, default: 0.0 },
    brand: { type: String, required: false },
    image: { type: String, required: true },
    description: { type: DescriptionSchema, required: false },
    promotion_active: { type: Boolean, required: true, default: false },
    quantity: { type: Number, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
});


export default mongoose.model<Product>('products', ProductSchema);