const {Delivery, Order} = require("~models");
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");
const orderService = require('~services/orderService');

const getById = async (deliveryId) => {
    if (!deliveryId){
        throw new BadRequestError('Delivery ID is required');
    }

    const foundDelivery = Delivery.findByPk(deliveryId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        }
    });

    if (!foundDelivery) {
        throw new NotFoundError('Delivery not found.');
    }

    return foundDelivery;
}

const getByOrderId = async (orderId) => {
    if (!orderId){
        throw new BadRequestError('Order ID is required');
    }

    const foundOrder = await orderService.getById(orderId);

    if (!foundOrder) {
        throw new NotFoundError('Order not found.');
    }

    const foundDelivery = await Delivery.findOne({
        where: {
            orderId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        }
    });

    if (!foundDelivery) {
        throw new NotFoundError('Delivery not found.');
    }

    return foundDelivery;
}

const addDelivery = async (
    orderId,
    shippingMethodId,
    address,
    firstName,
    lastName,
    phoneNumber,
    billingFirstName,
    billingLastName,
    billingAddress,
    billingPhoneNumber
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

    if (!billingFirstName) {
        throw new BadRequestError('Billing first name is required');
    }

    if (!billingLastName) {
        throw new BadRequestError('Billing last name is required');
    }

    if (!billingAddress) {
        throw new BadRequestError('Billing address is required');
    }

    const foundOrder = await Order.findByPk(orderId);
    if (!foundOrder) {
        throw new NotFoundError('Order not found');
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
        billingFirstName,
        billingLastName,
        billingAddress,
        billingPhoneNumber,
        status: 'PENDING'
    });
}

module.exports = {
    addDelivery,
    getById,
    getByOrderId,
};