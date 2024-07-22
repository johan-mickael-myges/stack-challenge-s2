const {Order, OrderItem, Product} = require("~models");
const BadRequestError = require("~errors/BadRequestError");

const buildOrderItem = async (item, orderId) => {
    const product = await Product.findByPk(item.productId);

    if (!product) {
        throw new BadRequestError(`Product with ID ${item.productId} not found`);
    }

    return {
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.dataValues.price,
        subtotal: product.dataValues.price * item.quantity,
    };
}

const createOrder = async (userId, items = []) => {
    if (!userId) {
        throw new BadRequestError('User ID is required');
    }

    if (items.length === 0) {
        throw new BadRequestError('Order must have items');
    }

    const order = await Order.create({
        userId,
        paymentMethod: 'PAYPAL',
    });

    const orderItems = await Promise.all(items.map(item => buildOrderItem(item, order.id)));
    await OrderItem.bulkCreate(orderItems);

    return order;
};

module.exports = {
    createOrder,
};
