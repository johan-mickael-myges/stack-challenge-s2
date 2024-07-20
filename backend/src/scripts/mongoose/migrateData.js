const { sequelize } = require('../../models'); // Sequelize instance
const connectDB = require('../../config/mongoose'); // Mongoose connection
const transformAndSaveProduct = require('../../services/mongoose/transformData');

const migrateData = async () => {
    await connectDB();
    const products = await sequelize.models.Product.findAll({ include: ['categories', 'brand', 'materials', 'colors'] });

    for (const product of products) {
        try {
            await transformAndSaveProduct(product);
        } catch (err) {
            console.error(err);
        }
    }

    console.log('Data migration completed.');
};

migrateData()
    .catch(err => console.error(err))
    .finally(() => process.exit());
