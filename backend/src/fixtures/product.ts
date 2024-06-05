import Product from '../models/ProductModel';
import createCategoryFixtures from './category';

export default async function createproductFixtures() {
  try {
    await Product.sync({ force: true });
    const categoryIds: any = await createCategoryFixtures();
    
    const products = [
      {
        name: 'Bague en or 18 carats',
        reference: 'GOLD001',
        category_id: categoryIds[0].dataValues.id,
        brand: 'Bijouterie Excellence',
        price: 500,
        description: 'Bague en or jaune 18 carats avec un diamant incrusté.',
        images: ['gold_ring1.jpg', 'gold_ring2.jpg'],
        promotion_active: false,
        quantity: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Collier en argent sterling',
        reference: 'SILVER002',
        category_id: categoryIds[1].dataValues.id,
        brand: 'Bijouterie Prestige',
        price: 350,
        description: 'Collier en argent sterling avec un pendentif en forme de cœur.',
        images: ['zorglux.png'],
        promotion_active: true,
        quantity: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await Product.bulkCreate(products);

    console.log('Products fixtures loaded successfully');
  } catch (error) {
    console.error('Error loading fixtures:', error);
  }
}
