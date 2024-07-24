const { DataTypes, Model } = require('sequelize');

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
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Le prénom du destinataire est requis',
                    },
                    len: {
                        args: [1, 255],
                        msg: 'Le prénom du destinataire doit comporter entre 1 et 255 caractères',
                    },
                },
            },
            lastName: {
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
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [10, 15],
                        msg: 'Le numéro de téléphone doit comporter entre 10 et 15 caractères',
                    },
                    isNumeric: {
                        msg: 'Le numéro de téléphone doit contenir uniquement des chiffres',
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
                allowNull: true, // Allow null values
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
            billingFirstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Le prénom de facturation est requis',
                    },
                    len: {
                        args: [1, 255],
                        msg: 'Le prénom de facturation doit comporter entre 1 et 255 caractères',
                    },
                },
            },
            billingLastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Le nom de facturation est requis',
                    },
                    len: {
                        args: [1, 255],
                        msg: 'Le nom de facturation doit comporter entre 1 et 255 caractères',
                    },
                },
            },
            billingAddress: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'L\'adresse de facturation est requise',
                    },
                },
            },
            billingPhoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [10, 15],
                        msg: 'Le numéro de téléphone de facturation doit comporter entre 10 et 15 caractères',
                    },
                    isNumeric: {
                        msg: 'Le numéro de téléphone de facturation doit contenir uniquement des chiffres',
                    },
                },
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
