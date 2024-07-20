const { Material } = require('~models');

exports.getAllMaterials = async (req, res, next) => {
    try {
        const colors = await Material.findAll({
            attributes: ['id', 'name']
        });
        res.status(200).json(colors);
    } catch (error) {
        next(error);
    }
};