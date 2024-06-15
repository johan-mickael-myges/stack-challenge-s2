const { DataTypes, Model } = require('sequelize');

class Delivery extends Model {
    static associate(models) {
        Delivery.belongsTo(models.ShippingMethod,{onDelete: 'SET NULL'});
        Delivery.belongsTo(models.Order);
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
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
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
