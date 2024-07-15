const { Cart, CartItem, Product, User } = require('../models');

exports.addToCart = async (req, res) => {
    try {
        const { productId, userId = 1, quantity } = req.body;

        // Find the product by its ID
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.sendStatus(404);
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            cart = await Cart.create({ userId });
        }

        // Check if the product is already in the cart
        let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });

        if (cartItem) {
            // Update the quantity if the product is already in the cart
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Add the product to the cart with the specified quantity
            cartItem = await CartItem.create({ cartId: cart.id, productId: product.id, quantity });
        }

        return res.status(201).json(cartItem);
    } catch (error) {
        next(error);
    }
};
exports.getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify that the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            res.sendStatus(404);
        }

        // Find the user's cart
        const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product] }] });

        if (!cart) {
            res.sendStatus(404);
        }

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Verify that the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            res.sendStatus(404);
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            res.sendStatus(404);
        }

        // Find the cart item
        const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
        if (!cartItem) {
            res.sendStatus(404);
        }

        // Remove the cart item
        await cartItem.destroy();

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

