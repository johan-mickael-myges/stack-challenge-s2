import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document  {
    name: string;
    price: number;
    image: string;
    description: string;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0.0 },
    image: { type: String },
    description: { type: String },
});

export default mongoose.model<Product>('products', ProductSchema);
