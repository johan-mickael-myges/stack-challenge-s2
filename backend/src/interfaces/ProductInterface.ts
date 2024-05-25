import Document from 'mongoose';
import Category from './CategoryInterface';

interface Description {
    weight?: number;
    height?: number;
    width?: number;
    depth?: number;
    text?: string;
}

export default interface Product extends Document  {
    name: string;
    reference: string;
    category: Category;
    price: number;
    brand?: string;
    image: string;
    description?: Description;
    promotion_active: boolean;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

