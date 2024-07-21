const factory = async (sequelizeProduct) => {
    const categories = await sequelizeProduct.getCategories();
    const brand = await sequelizeProduct.getBrand();
    const materials = await sequelizeProduct.getMaterials();
    const colors = await sequelizeProduct.getColors();

    return {
        originalId: sequelizeProduct.id,
        name: sequelizeProduct.name,
        reference: sequelizeProduct.reference,
        price: parseFloat(sequelizeProduct.price),
        description: sequelizeProduct.description,
        thumbnail: sequelizeProduct.thumbnail,
        images: sequelizeProduct.images,
        weight: sequelizeProduct.weight,
        brand: brand ? brand.name : null,
        categories: categories.map(category => category.name),
        materials: materials.map(material => material.name),
        colors: colors.map(color => color.name)
    };
}

module.exports = factory;