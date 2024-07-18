const { Order, OrderItem, Product } = require('../models');

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingMethod, address, items, paymentMethod } = req.body;
    const userId = req.user.userId;

    console.log('Creating order with details:', { userId, paymentMethod, shippingMethod, address, items });

    // Create a new order
    const order = await Order.create({
      userId,
      paymentMethod,
      // Add any additional fields required for shippingMethod and address if they exist in your model
    });

    console.log('Order created with ID:', order.id);

    // Create order items
    const orderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity
    }));

    console.log('Creating order items:', orderItems);

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