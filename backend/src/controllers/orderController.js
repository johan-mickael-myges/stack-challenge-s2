const { Order, OrderItem, Product } = require('~models');
const { Delivery, ShippingMethod } = require('~models');
const { createOrder } = require('~services/orderService');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod } = req.body;

    const order = await createOrder(req.user.userId, items, {
        paymentMethod,
    });

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
    console.log('Updating delivery details for order:', orderId);
    console.log('Shipping method:', shippingMethod);
    console.log('Address:', address);
    console.log('Recipient name:', recipientName);

    const shippingMethodRecord = await ShippingMethod.findOne({ where: { name: shippingMethod } });
    if (!shippingMethodRecord) {
      console.log('Shipping method not found:', shippingMethod);
      return res.status(404).json({ message: 'Shipping method not found' });
    }

    console.log('Shipping method found:', shippingMethodRecord);

    const delivery = await Delivery.create({
      orderId: orderId,
      recipientName: recipientName,
      address: address,
      shippingMethodId: shippingMethodRecord.id,
      status: 'PENDING',
    });

    console.log('Delivery created:', delivery);

    res.status(200).json({ message: 'Delivery details updated successfully', delivery });
  } catch (error) {
    next(error);
  }
};