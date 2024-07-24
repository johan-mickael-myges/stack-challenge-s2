const { Order, OrderItem, Product, Delivery, ShippingMethod } = require('~models');
const { createOrder } = require('~services/orderService');
const deliveryService = require('~services/deliveryService');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

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

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
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


exports.getDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const delivery = await deliveryService.getByOrderId(orderId);
    res.status(200).send(delivery);
  } catch (err) {
    next(err);
  }
}

exports.getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Trouver la commande par ID
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

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Logique de génération de PDF
    const doc = new PDFDocument();
    let filename = `invoice_${order.id}.pdf`;

    // Stream le PDF en tant que pièce jointe
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');

    doc.text(`Invoice for Order ${order.id}`);
    // Ajoutez ici les détails de la facture

    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};