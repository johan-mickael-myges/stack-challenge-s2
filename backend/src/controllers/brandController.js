const { Brand } = require('~models');
const {buildQueryOptions} = require("~utils/queryOptionsFactory");
const BadRequestError = require('~errors/BadRequestError');

const countBrands = async (req, res, next) => {
    try {
        const count = await Brand.count();
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}

const getAllBrands = async (req, res, next) => {
    try {
        let options = buildQueryOptions(req.query);

        options.attributes = {exclude: ['createdAt', 'updatedAt']};

        const brands = await Brand.findAll(options);
        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
};

const getBrandById = async (req, res, next) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.sendStatus(404);
        }
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
};

const createBrand = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newBrand = await Brand.create({ name });
        res.status(201).json(newBrand);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError('Le nom de la marque doit être unique');
        }
        next(error);
    }
};

const updateBrand = async (req, res, next) => {
    try {
        const { name } = req.body;
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.sendStatus(404);
        }
        await brand.update({ name });
        res.json(brand);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError('Le nom de la marque doit être unique');
        }
        next(error);
    }
};

const deleteBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.sendStatus(404);
        }
        await brand.destroy();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    countBrands,
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
};
