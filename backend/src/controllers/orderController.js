const { Order, OrderItem, Product } = require('../models');
const { Delivery, ShippingMethod } = require('../models');

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingMethod, address, items, paymentMethod } = req.body;
    const userId = req.user.userId;

    const order = await Order.create({
      userId,
      paymentMethod,
      // Add any additional fields required for shippingMethod and address etcetc
    });

    const orderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error', error });
    next(error);
  }
};

exports.getOrderDetails = async (req, res, next) => {
    try {
      const { orderId } = req.params;
  
      console.log('Fetching order details for order ID:', orderId);
  
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
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal server error', error });
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
    console.error('Error updating delivery details:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error', error });
    }
    next(error);
  }
};