const service = require('../services/stockService');

exports.allForProduct = async (req, res, next) => {
    const { id } = req.params;

    try  {
        const stocks = await service.getAllForProduct(id);
        res.status(200).json(stocks);
    } catch (error) {
        next(error);
    }
}