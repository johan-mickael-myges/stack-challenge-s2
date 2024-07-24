const { Material } = require('~models');
const eventEmitter = require('~services/eventEmitter');
const materialService = require('~services/materialService');

const countMaterials = async (req, res, next) => {
    try {
        const count = await Material.count();
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
}

const getAllMaterials = async (req, res, next) => {
    try {
        const colors = await Material.findAll({
            attributes: ['id', 'name']
        });
        res.status(200).json(colors);
    } catch (error) {
        next(error);
    }
};

const getMaterialById = async (req, res, next) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) {
            return res.sendStatus(404);
        }
        res.status(200).json(material);
    } catch (error) {
        next(error);
    }
};

const createMaterial = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newMaterial = await Material.create({ name });
        res.status(201).json(newMaterial);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError('Le nom du matériel doit être unique');
        }
        next(error);
    }
};

const updateMaterial = async (req, res, next) => {
    try {
        const { name } = req.body;
        const material = await Material.findByPk(req.params.id);
        if (!material) {
            return res.sendStatus(404);
        }
        const oldMaterial = material.name;
        await material.update({ name });
        eventEmitter.emit('materialUpdated', material.name, oldMaterial);
        res.json(material);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError('Le nom du matériel doit être unique');
        }
        next(error);
    }
};

const deleteMaterial = async (req, res, next) => {
    try {
        await materialService.deleteMaterial(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    countMaterials,
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
};