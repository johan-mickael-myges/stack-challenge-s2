const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    originalId: { type: Number, required: true },
    name: { type: String, required: true },
    reference: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    thumbnail: { type: String, required: true },
    images: { type: [String] },
    weight: { type: Number, min: 0 },
    brand: { type: String, ref: 'Brand' },
    categories: [{ type: String, ref: 'Category' }],
    materials: [{ type: String, ref: 'Material' }],
    colors: [{ type: String, ref: 'Color' }],
    stocks: { type: Number, default: 0, min: 0}
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);