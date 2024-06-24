const { Brand } = require('~models');
const {buildQueryOptions} = require("~utils/queryOptionsFactory");

const getAllBrands = async (req, res, next) => {
    try {
        let options = buildQueryOptions(req.query);

        const brands = await Brand.findAndCountAll(options);
        res.status(200).json({
            total: brands.count,
            items: brands.rows,
        });
    } catch (error) {
        next(error);
    }
};

const getBrandById = async (req, res, next) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404);
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
            return res.status(400).json({ error: 'Brand name must be unique' });
        }
        next(error);
    }
};

const updateBrand = async (req, res, next) => {
    try {
        const { name } = req.body;
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404);
        }
        await brand.update({ name });
        res.json(brand);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Brand name must be unique' });
        }
        next(error);
    }
};

const deleteBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404);
        }
        await brand.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
};
