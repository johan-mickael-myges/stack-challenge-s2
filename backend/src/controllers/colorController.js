const { Color } = require('~models');

exports.getAllColors = async (req, res, next) => {
    try {
        const colors = await Color.findAll({
            attributes: ['id', 'name']
        });
        res.status(200).json(colors);
    } catch (error) {
        next(error);
    }
};