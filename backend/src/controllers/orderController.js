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
        {
          model: Delivery,
          include: [ShippingMethod],
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
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
        {
          model: Delivery,
          include: [ShippingMethod],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const doc = new PDFDocument();
    let filename = `invoice_${order.id}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');
    doc.fontSize(18).text('Facture', { align: 'center' });
    doc.fontSize(22).text('Layalin');
    doc.fontSize(12).text('242 Rue du Faubourg Saint-Antoine, 75012 Paris');
    doc.fontSize(12).text('Email: service-client@layalin.com');
    doc.fontSize(12).text('Téléphone: 01 56 06 90 41');
    doc.moveDown();

    
    doc.moveDown();

    doc.fontSize(12).text(`Commande ref: ${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toISOString()}`);
    doc.text(`Paiement Methode: ${order.paymentMethod}`);
    
    if (order.Delivery) {
      const recipientName = `${order.Delivery.firstName} ${order.Delivery.lastName}`;
      doc.text(`Adresse de livraison: ${recipientName}, ${order.Delivery.address}`);
    } else {
      doc.text('Adresse de livraison: N/A');
    }

    const total = order.OrderItems.reduce((sum, item) => sum + parseFloat(item.unitPrice) * item.quantity, 0).toFixed(2);
    doc.text(`Total: ${total} €`);
    doc.moveDown();

    order.OrderItems.forEach(item => {
      doc.text(`${item.Product.name} x ${item.quantity}`);
      doc.text(`Prix Unitaire: ${item.unitPrice} €`);
      const subtotal = (parseFloat(item.unitPrice) * item.quantity).toFixed(2);
      doc.text(`Sous-total: ${subtotal} €`);
      doc.moveDown();
    });

    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};

