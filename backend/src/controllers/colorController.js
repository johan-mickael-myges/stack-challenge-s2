const { Color } = require('~models');
const eventEmitter = require('~services/eventEmitter');

const countColors = async (req, res, next) => {
    try {
        const count = await Color.count();
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}

const getAllColors = async (req, res, next) => {
    try {
        const colors = await Color.findAll({
            attributes: ['id', 'name']
        });
        res.status(200).json(colors);
    } catch (error) {
        next(error);
    }
};

const getColorById = async (req, res, next) => {
    try {
        const color = await Color.findByPk(req.params.id);
        if (!color) {
            return res.sendStatus(404);
        }
        res.status(200).json(color);
    } catch (error) {
        next(error);
    }
};

const createColor = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newColor = await Color.create({ name });
        res.status(201).json(newColor);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError('Le nom de la couleur doit être unique');
        }
        next(error);
    }
};

const updateColor = async (req, res, next) => {
    try {
        const { name } = req.body;
        const color = await Color.findByPk(req.params.id);
        if (!color) {
            return res.sendStatus(404);
        }
        const oldColor = color.name;
        await color.update({ name });
        eventEmitter.emit('colorUpdated', color.name, oldColor);
        res.json(color);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError('Le nom de la couleur doit être unique');
        }
        next(error);
    }
};

const deleteColor = async (req, res, next) => {
    try {
        const color = await Color.findByPk(req.params.id);
        if (!color) {
            return res.sendStatus(404);
        }
        await color.destroy();
        eventEmitter.emit('colorDeleted', color.name);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    countColors,
    getAllColors,
    getColorById,
    createColor,
    updateColor,
    deleteColor,
};