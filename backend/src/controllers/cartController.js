const { Cart, CartItem, Product, User } = require('../models');

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        let cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            cart = await Cart.create({ userId });
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.sendStatus(404);
        }

        let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ cartId: cart.id, productId: product.id, quantity });
        }

        return res.status(201).json(cartItem);
    } catch (error) {
        next(error);
    }
};

exports.getCartItems = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.sendStatus(404);
        }

        const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product] }] });

        if (!cart) {
            return res.sendStatus(404);
        }

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.sendStatus(404);
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.sendStatus(404);
        }

        const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
        if (!cartItem) {
            return res.sendStatus(404);
        }

        await cartItem.destroy();

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

exports.updateCartItemQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.sendStatus(404);
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.sendStatus(404);
        }

        const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
        if (!cartItem) {
            return res.sendStatus(404);
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.sendStatus(404);
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.sendStatus(404);
        }

        await CartItem.destroy({ where: { cartId: cart.id } });

        return res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        next(error);
    }
};

