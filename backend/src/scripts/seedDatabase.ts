import ProductModel from '../models/ProductModel';
import CategoryModel from '../models/CategoryModel';

const seedDatabase = async () => {
    try {  
        await CategoryModel.deleteMany({});
        await ProductModel.deleteMany({});

        const category = new CategoryModel({
            name: 'Electronics',
            description: 'Electronic devices and gadgets'
        });
        await category.save();

        const product = new ProductModel({
            name: 'Smartphone',
            reference: 'SP1234',
            price: 299.99,
            brand: 'BrandName',
            image: 'http://example.com/image.jpg',
            category: category._id,
            description: {
                weight: 200,
                height: 150,
                width: 70,
                depth: 8,
                text: 'A high-quality smartphone with excellent features.',
            },
            promotion_active: true,
            quantity: 50
        });

        await product.save();
        console.log('Database seeded successfully');
        
    } catch (e) {
        console.error('Failed to seed database', e);
    }
};

export default seedDatabase;

