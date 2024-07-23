const {Delivery, Order} = require("~models");
const BadRequestError = require("~errors/BadRequestError");

const addDelivery = async (
    orderId,
    shippingMethodId,
    address,
    firstName,
    lastName,
    phoneNumber,
) => {
    if (!orderId) {
        throw new BadRequestError('Order ID is required');
    }

    if (!shippingMethodId) {
        throw new BadRequestError('Shipping method ID is required');
    }

    if (!address) {
        throw new BadRequestError('Address is required');
    }

    if (!firstName) {
        throw new BadRequestError('First name is required');
    }

    if (!lastName) {
        throw new BadRequestError('Last name is required');
    }

    const foundOrder = await Order.findByPk(orderId);
    if (!foundOrder) {
        throw new BadRequestError('Order not found');
    }

    const existingOrderDelivery = await Delivery.findOne({
        where: {
            orderId,
        },
    });
    if (existingOrderDelivery) {
        throw new BadRequestError('Delivery for this order already exists');
    }

    return await Delivery.create({
        orderId,
        shippingMethodId,
        address,
        firstName,
        lastName,
        phoneNumber,
        status: 'PENDING'
    });
}

module.exports = {
    addDelivery,
};
