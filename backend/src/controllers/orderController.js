const { Order, OrderItem, Product } = require('~models');
const { Delivery, ShippingMethod } = require('~models');
const { createOrder } = require('~services/orderService');

exports.createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    const order = await createOrder(req.user.userId, items);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateDeliveryDetails = async (req, res, next) => {
  try {
    const { orderId, shippingMethod, address, recipientName } = req.body;

    const shippingMethodRecord = await ShippingMethod.findOne({ where: { name: shippingMethod } });
    if (!shippingMethodRecord) {
      return res.status(404).json({ message: 'Shipping method not found' });
    }

    const delivery = await Delivery.create({
      orderId: orderId,
      recipientName: recipientName,
      address: address,
      shippingMethodId: shippingMethodRecord.id,
      status: 'PENDING',
    });

    res.status(200).json({ message: 'Delivery details updated successfully', delivery });
  } catch (error) {
    next(error);
  }
};

exports.getPaidOrders = async (req, res, next) => {
  try {
      const userId = req.user.userId; 
      const paidOrders = await Order.findAll({
          where: {
              userId: userId,
              paymentStatus: 'paid'
          },
          include: [
              {
                  model: OrderItem,
                  include: [Product],
              },
          ],
      });
      res.status(200).json(paidOrders);
  } catch (error) {
      next(error);
  }
};
