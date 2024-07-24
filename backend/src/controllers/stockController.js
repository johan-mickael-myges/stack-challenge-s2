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

exports.countRemainingForProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        const count = await service.countRemainingForProduct(id);
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}

exports.addProductStock = async (req, res, next) => {
    const { id, quantity, type } = req.body;

    try {
        await service.addProductStock(id, quantity, type);

        res.sendStatus(201);
    } catch (error) {
        next(error);
    }
}