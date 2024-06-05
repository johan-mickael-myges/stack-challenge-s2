import Category from '../models/CategoryModel';
import { sequelize } from '../config/database/sequelize';

export default async function createCategoryFixtures() {
  try {
    await Category.sync({ force: true });

    const categories = await Category.bulkCreate([
      {
        name: 'Bijoux',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Montres',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bracelets',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Boucles d\'oreilles',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    console.log('Category fixtures created successfully.');
    return categories;
  } catch (error) {
    console.error('Error creating category fixtures:', error);
    throw error;
  }
}
