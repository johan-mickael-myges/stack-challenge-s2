const {Order, OrderItem, Product} = require("~models");
const {PAYMENT_METHOD_PAYPAL, PAYMENT_METHOD_STRIPE} = require("~constants/paymentMethod");
const BadRequestError = require("~errors/BadRequestError");

const validatePaymentMethod = (method) => {
    return [
        PAYMENT_METHOD_PAYPAL,
        PAYMENT_METHOD_STRIPE,
    ].includes(method);
}

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

const createOrder = async (userId, items = [], options = {}) => {
    if (!userId) {
        throw new BadRequestError('User ID is required');
    }

    const paymentMethod = options.paymentMethod || PAYMENT_METHOD_PAYPAL;
    if (!validatePaymentMethod(paymentMethod)) {
        throw new BadRequestError('Invalid payment method');
    }

    if (items.length === 0) {
        throw new BadRequestError('Order must have items');
    }

    const order = await Order.create({
        userId,
        paymentMethod,
    });

    const orderItems = await Promise.all(items.map(item => buildOrderItem(item, order.id)));
    await OrderItem.bulkCreate(orderItems);

    return order;
};

module.exports = {
    createOrder,
};
