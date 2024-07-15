const {DataTypes, Model} = require('sequelize');

class Delivery extends Model {
    static associate(models) {
        Delivery.belongsTo(models.ShippingMethod, {
            foreignKey: 'shippingMethodId',
            onDelete: 'SET NULL',
        });
        Delivery.belongsTo(models.Order, {
            foreignKey: 'orderId'
        });
    }
}

module.exports = (sequelize) => {
    Delivery.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                recipientName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: 'Le nom du destinataire est requis',
                        },
                        len: {
                            args: [1, 255],
                            msg: 'Le nom du destinataire doit comporter entre 1 et 255 caractères',
                        },
                    },
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: {
                            msg: 'L\'adresse est requise',
                        },
                    },
                },
                status: {
                    type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                    allowNull: false,
                    defaultValue: 'PENDING',
                    validate: {
                        isIn: {
                            args: [['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']],
                            msg: 'Le statut doit être PENDING, SHIPPED, DELIVERED ou CANCELLED',
                        },
                    },
                },
                shippingMethodId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'shipping_methods',
                        key: 'id'
                    },
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE'
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'orders',
                        key: 'id'
                    },
                    allowNull: false,
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                },
            },
            {
                sequelize,
                modelName: 'Delivery',
                tableName: 'deliveries',
                timestamps: true,
            }
    );

    return Delivery;
};
